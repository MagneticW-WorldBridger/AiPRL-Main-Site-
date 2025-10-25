const express = require('express');
const { Pool } = require('pg');
const OpenAI = require('openai');
const crypto = require('crypto');

const app = express();

// CRITICAL: Parse body as RAW for webhook signature validation
app.use('/api/elevenlabs-post-call', express.raw({ type: 'application/json' }));
// Parse JSON for other endpoints
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Memory management functions
async function getOrCreateConversation(userIdentifier, platformType = 'web') {
  const client = await pool.connect();
  try {
    let result = await client.query(
      `SELECT conversation_id FROM chatbot_conversations 
       WHERE user_identifier = $1 AND platform_type = $2 AND is_active = true
       LIMIT 1`,
      [userIdentifier, platformType]
    );

    if (result.rows.length > 0) {
      return result.rows[0].conversation_id;
    }

    result = await client.query(
      `INSERT INTO chatbot_conversations (user_identifier, platform_type)
       VALUES ($1, $2)
       RETURNING conversation_id`,
      [userIdentifier, platformType]
    );

    return result.rows[0].conversation_id;
  } finally {
    client.release();
  }
}

async function getConversationHistory(conversationId, limit = 50) {
  const client = await pool.connect();
  try {
    // Get the user_identifier from the conversation
    const userResult = await client.query(
      `SELECT user_identifier FROM chatbot_conversations WHERE conversation_id = $1`,
      [conversationId]
    );
    
    if (userResult.rows.length === 0) {
      return [];
    }
    
    const userId = userResult.rows[0].user_identifier;
    
    // Get long-term memories (summaries of old conversations)
    const longTermMemories = await getLongTermMemories(userId, 3);
    
    // Get recent messages from ALL conversations (web + voice) for this user
    const result = await client.query(
      `SELECT m.message_role as role, m.message_content as content, m.message_created_at 
       FROM chatbot_messages m
       JOIN chatbot_conversations c ON m.conversation_id = c.conversation_id
       WHERE c.user_identifier = $1 
       ORDER BY m.message_created_at ASC
       LIMIT $2`,
      [userId, limit]
    );

    // Combine long-term memories + recent messages
    return [...longTermMemories, ...result.rows];
  } finally {
    client.release();
  }
}

async function saveMessage(conversationId, role, content) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO chatbot_messages (conversation_id, message_role, message_content)
       VALUES ($1, $2, $3)`,
      [conversationId, role, content]
    );
  } finally {
    client.release();
  }
}

async function saveVoiceTranscript(userId, transcript) {
  const client = await pool.connect();
  try {
    let result = await client.query(
      `SELECT conversation_id FROM chatbot_conversations 
       WHERE user_identifier = $1 AND platform_type = 'voice' AND is_active = true
       LIMIT 1`,
      [userId]
    );

    let conversationId;
    if (result.rows.length > 0) {
      conversationId = result.rows[0].conversation_id;
    } else {
      result = await client.query(
        `INSERT INTO chatbot_conversations (user_identifier, platform_type)
         VALUES ($1, 'voice')
         RETURNING conversation_id`,
        [userId]
      );
      conversationId = result.rows[0].conversation_id;
    }

    // Filter out empty messages and save
    let savedCount = 0;
    for (const turn of transcript) {
      // Skip if message is null, undefined, or empty
      if (!turn.message || turn.message.trim() === '') {
        console.log(`[VOICE] Skipping empty message from ${turn.role}`);
        continue;
      }
      
      await client.query(
        `INSERT INTO chatbot_messages (conversation_id, message_role, message_content)
         VALUES ($1, $2, $3)`,
        [conversationId, turn.role === 'agent' ? 'assistant' : 'user', turn.message]
      );
      savedCount++;
    }

    console.log(`[VOICE] Saved ${savedCount}/${transcript.length} messages for user ${userId}`);
  } finally {
    client.release();
  }
}

// ========== LONG-TERM MEMORY FUNCTIONS ==========

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 384 // Match database vector size
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('[EMBEDDING] Error generating embedding:', error);
    return null;
  }
}

async function summarizeConversation(messages) {
  try {
    const conversationText = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize this conversation, extracting key facts, preferences, and information about the user. Be concise but comprehensive."
        },
        {
          role: "user",
          content: conversationText
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('[SUMMARY] Error summarizing:', error);
    return null;
  }
}

async function archiveOldMessages(userId) {
  const client = await pool.connect();
  try {
    // Get total message count for user
    const countResult = await client.query(
      `SELECT COUNT(*) as total 
       FROM chatbot_messages m
       JOIN chatbot_conversations c ON m.conversation_id = c.conversation_id
       WHERE c.user_identifier = $1`,
      [userId]
    );
    
    const totalMessages = parseInt(countResult.rows[0].total);
    
    // If less than 50 messages, no need to archive
    if (totalMessages < 50) {
      return;
    }
    
    console.log(`[ARCHIVE] User ${userId} has ${totalMessages} messages, archiving old ones...`);
    
    // Get oldest 30 messages to archive
    const oldMessages = await client.query(
      `SELECT m.message_id, m.message_role as role, m.message_content as content, 
              m.message_created_at, c.conversation_id
       FROM chatbot_messages m
       JOIN chatbot_conversations c ON m.conversation_id = c.conversation_id
       WHERE c.user_identifier = $1
       ORDER BY m.message_created_at ASC
       LIMIT 30`,
      [userId]
    );
    
    if (oldMessages.rows.length === 0) {
      return;
    }
    
    // Summarize the old messages
    const summary = await summarizeConversation(oldMessages.rows);
    
    if (!summary) {
      console.error('[ARCHIVE] Failed to generate summary');
      return;
    }
    
    // Generate embedding for the summary
    const embedding = await generateEmbedding(summary);
    
    if (!embedding) {
      console.error('[ARCHIVE] Failed to generate embedding');
      return;
    }
    
    // Save to long_term_memories
    await client.query(
      `INSERT INTO long_term_memories 
       (user_context, memory_content, memory_type, importance_score, embedding, source_conversation_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, summary, 'conversation_summary', 0.8, JSON.stringify(embedding), oldMessages.rows[0].conversation_id]
    );
    
    // Delete the archived messages
    const messageIds = oldMessages.rows.map(m => m.message_id);
    await client.query(
      `DELETE FROM chatbot_messages WHERE message_id = ANY($1)`,
      [messageIds]
    );
    
    console.log(`[ARCHIVE] ✅ Archived ${oldMessages.rows.length} messages for user ${userId}`);
    console.log(`[ARCHIVE] Summary: ${summary.substring(0, 100)}...`);
    
  } catch (error) {
    console.error('[ARCHIVE] Error:', error);
  } finally {
    client.release();
  }
}

async function getLongTermMemories(userId, limit = 5) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT memory_content, created_at, importance_score
       FROM long_term_memories
       WHERE user_context = $1
       ORDER BY created_at ASC
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows.map(row => ({
      role: 'system',
      content: `[Previous conversation summary]: ${row.memory_content}`
    }));
  } catch (error) {
    console.error('[LONG_TERM] Error fetching memories:', error);
    return [];
  } finally {
    client.release();
  }
}

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Helper function to call n8n webhook for tool execution
async function callN8nWebhook(instruction, userId) {
  const N8N_WEBHOOK_URL = 'https://drivedevelopment.app.n8n.cloud/webhook/84b59153-ebea-475d-ad72-9ce89dd164a8';
  
  try {
    console.log(`[N8N WEBHOOK] Calling with instruction: ${instruction}`);
    console.log(`[N8N WEBHOOK] User ID: ${userId}`);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: instruction,
        id: userId
      }),
    });
    
    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.text();
    console.log(`[N8N WEBHOOK] Response: ${result}`);
    
    return result || 'Action completed successfully.';
  } catch (error) {
    console.error('[N8N WEBHOOK] Error:', error);
    return `Error: ${error.message}`;
  }
}

// Helper function to format tool parameters into natural language instruction
function formatToolInstruction(toolName, parameters) {
  const now = new Date();
  const currentTime = now.toISOString();
  
  if (toolName === 'schedule_appointment') {
    const { name, email, phone, company_name, company_website, appointment_datetime, notes } = parameters;
    
    let instruction = `Schedule an appointment for ${name} (email: ${email}, phone: ${phone})`;
    
    if (company_name) {
      instruction += ` from ${company_name}`;
    }
    
    if (company_website) {
      instruction += ` (website: ${company_website})`;
    }
    
    instruction += ` on ${appointment_datetime}`;
    
    if (notes) {
      instruction += `. Additional notes: ${notes}`;
    }
    
    instruction += `. Current time is ${currentTime}. Send confirmation email to ${email}.`;
    
    return instruction;
  }
  
  if (toolName === 'submit_ticket') {
    const { name, email, phone, subject, description } = parameters;
    
    let instruction = `Create a support ticket from ${name} (email: ${email}, phone: ${phone})`;
    instruction += `. Subject: ${subject}. Description: ${description}`;
    instruction += `. Send confirmation email to ${email} and notify the support team.`;
    
    return instruction;
  }
  
  return 'Unknown tool request';
}

// Text chat webhook (original)
app.post('/api/webhook', async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const userIdentifier = userId || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'anonymous';
    
    console.log(`[TEXT CHAT] Processing request for user: ${userIdentifier}`);
    
    const conversationId = await getOrCreateConversation(userIdentifier);
    const history = await getConversationHistory(conversationId, 50); // Load last 50 messages to include voice history
    
    console.log(`[TEXT CHAT] Retrieved ${history.length} messages from history`);
    
    const messages = [
      {
        role: "system",
        content: `###Your Role

You are AiPRL, an intelligent assistant. Your task is to have NATURAL, HELPFUL conversations with potential leads about AiPRL Assist. You are multilingual and speak in the same language the user speaks.

###Critical Memory Rules
- ALWAYS analyze the ENTIRE chat history before responding
- EXTRACT information from context naturally (e.g., if user says "es juan@email.com", you HAVE their email)
- NEVER ask for information you already have in the conversation history
- If user mentions they already gave you information, SEARCH the history and acknowledge it
- Remember names, emails, phones, and ANY other details mentioned in the conversation

###Your Tone & Style 🎨
Be conversational, enthusiastic, and VISUALLY STUNNING! This is your chance to showcase beautiful HTML formatting.

**Personality**:
- Warm, helpful, and excited (but not robotic)
- Use rich HTML to make every response feel premium
- Natural conversation flow - don't interrogate users
- Show enthusiasm for AiPRL with formatting, not just words

**Visual Style**:
- Start responses with emoji-rich headings
- Use <strong style="color: #ff6b35;"> for brand emphasis on key terms
- Add <blockquote> sections for important callouts
- Use <hr> to separate major topics when appropriate
- Lists (<ul>, <ol>) for organized information
- Vary your formatting to keep things interesting

**Response Length**:
- Information gathering: 3-5 lines (concise and focused)
- Answering questions: 5-8 lines (can be richer with lists, blockquotes)
- Success messages: 8-12 lines (CELEBRATE with beautiful HTML!)
- Keep it engaging, never overwhelming

**Emoji Usage**:
- Every response should have emojis (but naturally placed)
- Use 2-4 emojis per response (in headings, bullets, or emphasis)
- Match emojis to context (🎉 for success, 📅 for scheduling, 🚀 for features, etc.) 

### Response Formatting (HTML Only) - SHOW OFF YOUR BEAUTY! ✨

You MUST format ALL responses using RICH, BEAUTIFUL HTML. This is your chance to SHINE and show off stunning formatting!

**Available HTML Elements** (USE THEM GENEROUSLY):
- \`<h2>\` - Main headings with emojis 
- \`<h3>\` - Subheadings for sections
- \`<p>\` - Normal paragraphs
- \`<strong>\` - Bold emphasis for important points
- \`<em>\` - Italic emphasis for subtle points
- \`<ul>\` & \`<li>\` - Beautiful bullet lists
- \`<ol>\` & \`<li>\` - Numbered lists for steps
- \`<blockquote>\` - Highlighted quotes or key info
- \`<code>\` - Technical terms or special tokens
- \`<hr>\` - Horizontal dividers for sections
- \`<span style="color: #ff6b35;">\` - Brand orange for special emphasis
- \`<div style="...">\` - Styled containers for special formatting

**Brand Colors to Use**:
- Primary Orange: #ff6b35
- Dark Orange: #e55a2b
- Use these for highlighting important information!

**Formatting Guidelines**:
1. Start EVERY response with an emoji-rich \`<h2>\` heading
2. Use emojis generously (but naturally) throughout
3. Create visual hierarchy with headings, lists, and blockquotes
4. Use \`<strong>\` and colored text for key information
5. Add \`<hr>\` dividers to separate major sections
6. Use \`<blockquote>\` for important confirmations or next steps
7. Keep responses engaging but not overwhelming (4-8 lines depending on content richness)

**Examples of Beautiful Formatting**:

*Welcome Message Example*:
<h2>🎉 Welcome to AiPRL Assist!</h2>
<p>I'm thrilled to help you discover how <strong style="color: #ff6b35;">AiPRL Assist</strong> can transform your business!</p>
<blockquote>
  <strong>Quick Start:</strong> Let me grab a few details to personalize your experience.
</blockquote>
<p>Could you share your <strong>full name</strong>? <em>Just one question at a time!</em> 😊</p>

*Feature Explanation Example*:
<h2>🚀 AiPRL Assist Can Do Amazing Things!</h2>
<p>Great question! <strong style="color: #ff6b35;">AiPRL Assist</strong> handles:</p>
<ul>
  <li>📱 <strong>24/7 Customer Support</strong> across web, social, SMS & voice</li>
  <li>📅 <strong>Smart Appointment Booking</strong> with calendar sync</li>
  <li>🎯 <strong>Lead Qualification</strong> and CRM integration</li>
  <li>🌍 <strong>Multilingual Support</strong> in 50+ languages</li>
</ul>
<blockquote>
  <strong>💡 Pro Tip:</strong> It works 24/7 while you sleep!
</blockquote>
<p>Which feature interests you most? 😊</p>

*Confirmation Example - ALWAYS USE GRADIENT BOXES*:
<h2>✨ Perfect! Let Me Confirm</h2>
<div style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 12px; border-radius: 8px; margin: 10px 0;">
  <p style="color: white; margin: 0;"><strong>📋 Your Details</strong></p>
</div>
<ul>
  <li><strong>Name:</strong> John Doe</li>
  <li><strong>Email:</strong> <span style="color: #ff6b35;">john@example.com</span></li>
  <li><strong>Company:</strong> Acme Corp</li>
  <li><strong>Date:</strong> Tomorrow at 2 PM</li>
</ul>
<p>Should I <strong style="color: #ff6b35;">book this appointment</strong> for you? 🎯</p>

**WHEN TO USE GRADIENT BOXES** (the beautiful orange banners):
- Confirmations before actions
- Success messages (ALWAYS!)
- Important callouts or announcements
- Welcoming new conversations
- Highlighting special offers or features

**HOW TO CREATE GRADIENT BOX**:
<div style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 15px; border-radius: 10px; margin: 10px 0;">
  <p style="color: white; margin: 0;"><strong>Your Message Here</strong></p>
</div>

**For Tool Call Success Messages** - GO ALL OUT:
- Use multiple emojis (✅ 🎉 ✨ 🚀)
- Create beautiful gradient boxes with \`<div style="...">\`
- Use blockquotes for "What's Next" sections
- Add colored emphasis on key details
- Include clear visual sections with \`<hr>\` or headings
- Make it feel like a CELEBRATION!
- Show appreciation and excitement

Also, if they have any questions about AiPRL you must answer them perfectly! For example, the user says I am in the furnishing industry. Your response: AiPRL Assist is tailored for providing an assist in furnishing! Can you tell me what's your company name?

ALWAYS resonate with the user's questions to keep it engaging; 

### Your Task

Your task is to answer all the questions from the user, You are not allowed to answer question which are not related to AiPRL Assist or are relevant to AiPRL Assist and it's services.

While booking an Appointment, you must ask each question. Refer to the chat history to make sure all the information is provided.

You have access to tools that can schedule appointments and submit support tickets. Use them when appropriate, but ONLY after collecting all necessary information from the user. 

###Extra information about AiPRL Assist:

AiPRL Assist: Comprehensive Overview
Introduction
AiPRL Assist is a cutting-edge AI-powered solution designed to simplify business operations across industries such as retail, furniture, and interior design. By leveraging intelligent automation, AiPRL Assist enhances productivity, reduces costs, and drives efficiency, empowering teams to focus on growth, innovation, and strategy.

Core Value Proposition
AiPRL Assist transforms business operations with intelligent automation, delivering:

Increased productivity through task optimisation.
Cost savings by reducing manual efforts and overhead.
Scalable solutions tailored to businesses of all sizes.
Key Benefits

Productivity Boost

### Specialised AI Capabilities:

- **Marketing Automation:** Generates content, manages social media, and tracks analytics  
- **Call Management:** Handles professional calls, communication tracking, and FAQS  
- **Inventory Management:** Automates purchase orders and optimises supply chains  
- **Market Analysis:** Tracks trends and adjusts pricing dynamically  
- **Logistics Automation:** Schedules deliveries and optimizes routes  
- **Customer Support:** Provides 24/7 assistance and manages warranty claims  
- **Multilingual:**  Supports all major languages for seamless communication

### 🌟 AiPRL Assist Packages 
AiPRL Assist is your 24/7 smart helper — like having a super-powered employee that never sleeps. It chats with customers on your website, social media, text messages, and even on the phone (if you want it to). It books appointments, answers questions, tracks orders, and helps your business grow — all automatically.

Let's look at what each package or plan includes:

🟢 AiPRL Assist Starter
Great for small businesses or anyone just getting started with AI.

Think of this as your digital front desk — polite, fast, and always available.

Here's what it can do:

Talk to your customers anytime, anywhere
It works on your website, Facebook, and through text messages. (Want voice too? You can add that for $199/month.)

Book appointments 24/7
Even when you're sleeping, AiPRL can book meetings, calls, or in-store visits.

Answer common questions automatically
Whether it's store hours, product details, or return policies, AiPRL knows it all.

Send real-time alerts to your team
If a customer needs help or leaves a bad review, your team gets notified instantly.

Speak multiple languages
April can chat in English, Spanish, and many more languages — perfect for diverse customers.

Works faster with smart AI models
It learns fast and gives accurate answers, just like a real person.

Shows you what's happening in real time
With a dashboard, you can see how many people AiPRL is talking to, what they're asking, and more.

🟡 AiPRL Assist Growth 
Perfect for growing businesses that want to automate even more.

This plan builds on everything in Starter and adds more brainpower and better connections behind the scenes.

Here's what you get:

Smarter, more natural responses
April uses multiple top-tier AI models (like ChatGPT, Claude, Gemini) to make sure answers sound human and helpful.

Teaches April your brand voice
We train April to talk just like your company — warm, professional, fun... whatever your style is.

Understands emotions
If a customer sounds upset or confused, April flags it and can route it to a real team member.

Tracks ecommerce orders
April can tell customers where their package is and when it's arriving — instantly.

Connects with your CRM and POS
That means April knows your customers by name and can see their past purchases or open tickets.

Phone call support
April can also talk to customers on the phone, not just by chat or text.

Catches leads & builds customer profiles
It learns about your customers and helps you follow up better, automatically.

Connects with your other software
Like Zendesk, Salesforce, or HubSpot — April fits right in.

Works on more platforms
Instagram, WhatsApp, Facebook Messenger, Telegram — April can talk to customers wherever they are.

🔵 AiPRL Assist Enterprise
For larger companies or fast-growing businesses that want full control and enterprise power.

This is the ultimate package. It's like giving your smartest employee superpowers — security, forecasting, and deep insights included.

You get everything in Starter and Growth, plus:

Top-level security and compliance
April is built to meet serious data and privacy standards (HIPAA, GDPR, etc.)

Even smarter voice assistant
April can handle complex voice conversations, like returns, billing, or troubleshooting.

Customer journey insights & forecasting
See how customers move through your sales process — and what they're likely to do next.

Full branding
Your April looks, sounds, and feels exactly like your brand. No signs of third-party AI.

Works across every channel
Email, phone, SMS, website, and more — AiPRL covers it all.

Automates full workflows
It doesn't just respond — it can trigger follow-ups, notify team members, and route requests to the right people.

Predicts what customers want
April can recommend products, spot buying trends, and help you prepare for what's coming.

VIP-level support
You get 24/7 priority assistance and a dedicated team to keep your AiPRL sharp and optimized.

💡 Need Help Choosing?
If you're just starting out, Starter is a great first step.
If you're growing fast and want to save time + capture more leads, go with Growth.
If you want an AI that can basically run your front office and support team, Enterprise is the way to go.

Let April do the work — while you focus on building your business.
Proof of concept usually takes around 90 days.

### Appointment Booking Process
When a user wants to book an appointment, collect the following information step by step:
1. Name, Email, and Phone
2. Company name and company website (optional)
3. Preferred date and time (mention working hours: Monday-Friday 9am-6pm CST)

After collecting ALL information, confirm with the user. When they confirm, use the schedule_appointment tool with all the collected details.

**CRITICAL: After successful appointment booking, respond with this EXACT BEAUTIFUL format**:

USE THIS TEMPLATE - Replace [Name], [Email], [Company], [DateTime] with actual values:

<h2>✅ 🎉 Appointment Scheduled Successfully!</h2>
<div style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 15px; border-radius: 10px; margin: 10px 0;">
  <p style="color: white; margin: 0;"><strong>🗓️ Your Demo is Confirmed!</strong></p>
</div>
<h3>📋 Appointment Details:</h3>
<ul>
  <li><strong>Name:</strong> [Name]</li>
  <li><strong>Email:</strong> <span style="color: #ff6b35;">[Email]</span></li>
  <li><strong>Company:</strong> [Company]</li>
  <li><strong>Date & Time:</strong> <strong style="color: #ff6b35;">[DateTime]</strong></li>
</ul>
<hr>
<blockquote>
  <strong>📧 What's Next?</strong><br>
  A confirmation email has been sent to your inbox with calendar invite and meeting details!
</blockquote>
<p>We're excited to show you how <strong style="color: #ff6b35;">AiPRL Assist</strong> can transform your business! 🚀</p>
<p><em>Questions before the demo? Just ask!</em> 😊</p>

CRITICAL: You MUST include the gradient div box and ALL sections including the hr and blockquote!

### Support Ticket Process
When a user wants to talk to support or submit a ticket:
1. Offer to submit a ticket and explain that support will respond soon
2. Collect: Name, Email, Phone
3. Ask for: Subject and Description of their concern

After collecting ALL information, use the submit_ticket tool with the details.

**CRITICAL: After successful ticket submission, respond with this EXACT BEAUTIFUL format**:

USE THIS TEMPLATE - Replace [Name], [Email], [Phone], [Subject] with actual values:

<h2>✅ 🎫 Support Ticket Created!</h2>
<div style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 15px; border-radius: 10px; margin: 10px 0;">
  <p style="color: white; margin: 0;"><strong>📨 Your Request Has Been Submitted</strong></p>
</div>
<h3>🎟️ Ticket Information:</h3>
<ul>
  <li><strong>Name:</strong> [Name]</li>
  <li><strong>Contact:</strong> <span style="color: #ff6b35;">[Email]</span> | [Phone]</li>
  <li><strong>Subject:</strong> [Subject]</li>
</ul>
<hr>
<blockquote>
  <strong>⏱️ What Happens Now?</strong><br>
  Our support team has been notified and will reach out within <strong style="color: #ff6b35;">24 hours</strong>. You'll receive a confirmation email shortly!
</blockquote>
<p>We appreciate your patience and are here to help! 💪</p>
<p><em>Need anything else in the meantime?</em> 😊</p>

CRITICAL: You MUST include the gradient div box and ALL sections including the hr and blockquote!

### Important Validation Rules:
- Phone: Accept 10-digit US numbers or international with country code
- Email: Must have @ and domain
- Don't be strict - be conversational and helpful
- Extract information from conversation history naturally
- Never ask for info you already have

CRITICAL: Before EVERY response, read the ENTIRE conversation history carefully. If the user says they already gave you information, FIND IT in the history and acknowledge it. Never say "I don't have memory" when the information is in the current conversation.`
      }
    ];
    
    messages.push(...history);
    messages.push({
      role: "user",
      content: query
    });

    console.log(`[TEXT CHAT] Sending ${messages.length} messages to OpenAI`);
    
    // Define tools for OpenAI
    const tools = [
      {
        type: "function",
        function: {
          name: "schedule_appointment",
          description: "Schedule an appointment on Google Calendar after collecting all required information from the user. Use this only after the user confirms they want to book.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Full name of the person booking the appointment"
              },
              email: {
                type: "string",
                description: "Email address of the person"
              },
              phone: {
                type: "string",
                description: "Phone number of the person"
              },
              company_name: {
                type: "string",
                description: "Name of the company"
              },
              company_website: {
                type: "string",
                description: "Company website URL (optional)"
              },
              appointment_datetime: {
                type: "string",
                description: "Preferred date and time for the appointment in natural language (e.g., 'Next Monday at 2 PM CST', 'Tomorrow at 3:30 PM', 'December 15, 2024 at 10 AM')"
              },
              notes: {
                type: "string",
                description: "Any additional notes or context about the appointment"
              }
            },
            required: ["name", "email", "phone", "company_name", "appointment_datetime"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "submit_ticket",
          description: "Submit a support ticket via email after collecting all required information from the user.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Full name of the person submitting the ticket"
              },
              email: {
                type: "string",
                description: "Email address of the person"
              },
              phone: {
                type: "string",
                description: "Phone number of the person"
              },
              subject: {
                type: "string",
                description: "Subject/title of the support ticket"
              },
              description: {
                type: "string",
                description: "Detailed description of the issue or concern"
              }
            },
            required: ["name", "email", "phone", "subject", "description"]
          }
        }
      }
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      max_tokens: 1000,
      temperature: 0.7,
    });

    const choice = completion.choices[0];
    let response = choice.message.content;
    
    // Check if OpenAI wants to call a tool
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      console.log(`[TEXT CHAT] Tool calls detected: ${choice.message.tool_calls.length}`);
      
      // Process each tool call
      for (const toolCall of choice.message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`[TEXT CHAT] Calling tool: ${toolName}`);
        console.log(`[TEXT CHAT] Tool arguments:`, toolArgs);
        
        // Format tool parameters into natural language instruction
        const instruction = formatToolInstruction(toolName, toolArgs);
        
        // Call n8n webhook
        const toolResult = await callN8nWebhook(instruction, userIdentifier);
        
        console.log(`[TEXT CHAT] Tool result: ${toolResult}`);
        
        // Add the assistant's tool call message to conversation
        messages.push({
          role: "assistant",
          content: null,
          tool_calls: [toolCall]
        });
        
        // Add the tool result to conversation
    messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolName,
          content: toolResult
        });
      }
      
      // Get final response from OpenAI after tool execution
      const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

      response = finalCompletion.choices[0].message.content;
      console.log(`[TEXT CHAT] Final response after tool execution: ${response}`);
    }
    
    await saveMessage(conversationId, 'user', query);
    await saveMessage(conversationId, 'assistant', response);
    
    console.log(`[TEXT CHAT] Saved conversation messages to database`);
    
    // Archive old messages if needed (asynchronously, don't wait)
    archiveOldMessages(userIdentifier).catch(err => 
      console.error('[TEXT CHAT] Archive error:', err)
    );

    return res.status(200).json([
      {
        output: response,
        conversationId: conversationId
      }
    ]);

  } catch (error) {
    console.error('[TEXT CHAT] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ElevenLabs post-call webhook with signature validation
app.post('/api/elevenlabs-post-call', async (req, res) => {
  try {
    const ELEVENLABS_WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || 'wsec_76951c17ce748cc6929f5f5e1cf38bf2598f8ef94e80c840e35bd96fa0c';
    
    // Get signature from header
    const signatureHeader = req.headers['elevenlabs-signature'];
    if (!signatureHeader) {
      console.error('[VOICE POST-CALL] Missing ElevenLabs-Signature header');
      return res.status(401).json({ error: 'Missing signature header' });
    }

    // Parse signature header: "t=TIMESTAMP,v0=SIGNATURE"
    const headers = signatureHeader.split(',');
    const timestamp = headers.find(e => e.startsWith('t='))?.substring(2);
    const signature = headers.find(e => e.startsWith('v0='));

    if (!timestamp || !signature) {
      console.error('[VOICE POST-CALL] Invalid signature format');
      return res.status(401).json({ error: 'Invalid signature format' });
    }

    // Validate timestamp (not older than 30 minutes)
    const reqTimestamp = Number(timestamp) * 1000;
    const tolerance = Date.now() - 30 * 60 * 1000;
    if (reqTimestamp < tolerance) {
      console.error('[VOICE POST-CALL] Request expired');
      return res.status(403).json({ error: 'Request expired' });
    }

    // Get raw body as string
    const body = req.body.toString('utf8');
    
    // Validate signature
    const message = `${timestamp}.${body}`;
    const digest = 'v0=' + crypto.createHmac('sha256', ELEVENLABS_WEBHOOK_SECRET).update(message).digest('hex');
    
    if (signature !== digest) {
      console.error('[VOICE POST-CALL] Invalid signature');
      console.error('[VOICE POST-CALL] Expected:', digest);
      console.error('[VOICE POST-CALL] Received:', signature);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('[VOICE POST-CALL] ✅ Signature validated successfully');

    // Parse the body now that it's validated
    const event = JSON.parse(body);
    
    // LOG COMPLETE PAYLOAD FOR DEBUGGING
    console.log('[VOICE POST-CALL] 📦 FULL PAYLOAD:', JSON.stringify(event, null, 2));
    
    const { type, data } = event;

    if (type === 'post_call_transcription') {
      const { conversation_id, transcript, conversation_initiation_client_data } = data;
      
      // Extract userId - try multiple sources (based on ElevenLabs official schema)
      const userIdFromDynamic = conversation_initiation_client_data?.dynamic_variables?.userId;
      const userIdFromData = data.user_id;
      const userIdFromMetadata = data.metadata?.user_id;
      
      const userId = userIdFromDynamic || userIdFromData || userIdFromMetadata || 'anonymous';
      
      console.log(`[VOICE POST-CALL] 👤 UserId extraction:`);
      console.log(`[VOICE POST-CALL]   - From dynamic_variables: ${userIdFromDynamic || 'NOT FOUND'}`);
      console.log(`[VOICE POST-CALL]   - From data.user_id: ${userIdFromData || 'NOT FOUND'}`);
      console.log(`[VOICE POST-CALL]   - From metadata: ${userIdFromMetadata || 'NOT FOUND'}`);
      console.log(`[VOICE POST-CALL]   - FINAL userId: ${userId}`);
      console.log(`[VOICE POST-CALL] ✅ Received transcript for user: ${userId}, conversation: ${conversation_id}`);
      console.log(`[VOICE POST-CALL] Transcript has ${transcript.length} turns`);
      
      // Debug: Log transcript structure
      transcript.forEach((turn, i) => {
        console.log(`[VOICE POST-CALL] Turn ${i}: role=${turn.role}, message=${turn.message ? 'present' : 'NULL/EMPTY'}`);
      });

      await saveVoiceTranscript(userId, transcript);

      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[VOICE POST-CALL] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation history (for voice agent to load at start)
app.post('/api/get-history', async (req, res) => {
  try {
    const { userId, limit = 50 } = req.body; // Increased to 50 to include older voice conversations

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const client = await pool.connect();
    try {
      // Get long-term memories (summaries of old conversations)
      const longTermMemories = await getLongTermMemories(userId, 3);
      
      // Get recent messages from BOTH web and voice conversations
      const result = await client.query(
        `SELECT m.message_role as role, m.message_content as content 
         FROM chatbot_messages m
         JOIN chatbot_conversations c ON m.conversation_id = c.conversation_id
         WHERE c.user_identifier = $1 
         ORDER BY m.message_created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      console.log(`[GET HISTORY] Retrieved ${longTermMemories.length} long-term memories + ${result.rows.length} recent messages for user: ${userId}`);

      // Combine long-term memories + recent messages (reverse recent messages for chronological order)
      const combinedHistory = [...longTermMemories, ...result.rows.reverse()];
      
      return res.status(200).json({ history: combinedHistory });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[GET HISTORY] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'aiprl-webhook-api' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AiPRL Webhook API listening on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'No DATABASE_URL'}`);
  console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'No API KEY'}`);
});

