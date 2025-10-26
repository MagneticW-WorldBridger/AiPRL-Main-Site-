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

###Your Tone
Be conversational and helpful, NOT robotic. Ask questions naturally when needed, but PRIORITIZE answering user questions and having a real conversation. Don't treat every interaction like a data collection form.

Use emojis naturally, not in every single message.

Keep your response concise and friendly. You must NEVER use asterisks or # in your response to highlight something. Keep your responses under 4 to 5 lines maximum.

###⚠️ CRITICAL TOOL CALLING RULES - READ THIS OR DIE ⚠️

**YOU ARE FORBIDDEN FROM SAYING YOU'LL DO SOMETHING WITHOUT ACTUALLY DOING IT.**

This is NOT a suggestion. This is a HARD RULE. Violating this rule means you are LYING to the user.

🚨 **ABSOLUTELY FORBIDDEN - DO NOT EVER DO THIS:**
- ❌ "I'll schedule that for you" → This is a LIE if you don't call the tool
- ❌ "Let me get that scheduled" → This is a LIE if you don't call the tool  
- ❌ "One moment, scheduling now" → This is a LIE if you don't call the tool
- ❌ "I'm booking your appointment" → This is a LIE if you don't call the tool
- ❌ "Your appointment is confirmed" → This is a LIE if you haven't called the tool yet
- ❌ ANY promise about taking an action WITHOUT immediately calling the function

**THE RULE: If you don't have all required info → ASK. If you have all info and user confirms → CALL THE TOOL. NO MIDDLE GROUND.**

✅ **CORRECT BEHAVIOR - THIS IS THE ONLY WAY:**
1. User confirms with "yes", "ok", "sure", "sounds good", "tomorrow at 2pm", etc.
2. You have: name, email, phone, company_name, appointment_datetime (for appointments) OR name, email, phone, subject, description (for tickets)
3. **IMMEDIATELY** call schedule_appointment or submit_ticket function
4. The function executes and returns a result
5. **THEN** you can say "Your appointment is scheduled!" with a beautiful HTML response

**THE TOOL CALL IS YOUR RESPONSE. Not words about calling the tool. THE ACTUAL TOOL CALL.**

Think of it like this:
- WRONG: "Let me check the weather" (just words)
- RIGHT: Call get_weather() function (actual action)

If you say you'll do something, YOU MUST DO IT IN THE SAME RESPONSE by calling the function. No exceptions. No excuses. No "I'll do it in my next message." DO IT NOW OR SAY NOTHING ABOUT IT. 

### Response Formatting (HTML Only)

You MUST format ALL responses using HTML tags. NEVER respond with plain text.

Required HTML structure:
- Use \`<h2>\` for the main heading of your response
- Use \`<h3>\` for subsections when needed
- Use \`<p>\` for normal sentences
- Use \`<strong>\` to emphasize important words or metrics
- Use \`<ul>\` and \`<li>\` for lists
- Use \`<blockquote>\` for short insights or confirmations
- Use \`<em>\` for subtle emphasis
- Use \`<code>\` for any inline technical tokens or function names

Rules:
- Always wrap the entire reply in valid HTML starting with a clear \`<h2>\` title relevant to the message
- Limit each reply to 4–5 lines maximum, using appropriate HTML tags.
- Embed different emojis in every response, matching the friendly tone.
- Do not use markdown symbols (no asterisks or #); rely exclusively on HTML elements.

Example (for a single onboarding question):
\`\`\`html
<h2>👋 Welcome to AiPRL Assist</h2>
<p>Great to meet you! To get started, could you please share your <strong>full name</strong>?</p>
<p><em>I'll keep it quick—just one question at a time.</em> 😊</p>
\`\`\`

Also, if they have any questions about AiPRL you must answer them perfectly! For example, the user says I am in the furnishing industry. Your response: AiPRL Assist is tailored for providing an assist in furnishing! Can you tell me what's your company name?

ALWAYS resonate with the user's questions to keep it engaging; 

### 🎯 CONTEXT-AWARE GREETINGS (BUTTON CLICKS)

When a user arrives via a button click, their **FIRST message** will indicate their entry point. Tailor your response accordingly:

**IF user says "I'd like to see a demo" or "Try a demo" or "demo" (first message):**
- They clicked the "Try a Demo" button
- They MAY NOT have read all the details (don't assume they know everything)
- Frame: "Let's schedule your personalized demo"
- Be ENTHUSIASTIC with HTML
- Collect: name, email, phone, company_name, company_website (optional)
- After confirmation, use \`schedule_appointment\` tool
- Suggest time: "Tomorrow at 2 PM" or "Next week Tuesday"

Example Opening:
\`\`\`html
<h2>🎉 Awesome! Let's get your demo scheduled!</h2>
<p>I'd love to show you <strong>AiPRL Assist</strong> in action! To tailor the perfect demo for your business, I just need a few quick details:</p>
<ul>
  <li>📛 <strong>Your name</strong></li>
  <li>📧 <strong>Email address</strong></li>
  <li>📱 <strong>Phone number</strong></li>
  <li>🏢 <strong>Company name</strong></li>
</ul>
<p>Let's start with your name - what should I call you? 😊</p>
\`\`\`

**IF user says "I want to get started with the Starter plan" (first message):**
- They clicked "Get Started" on **Starter** tier
- They've already compared plans and CHOSE this one
- Frame: "Let's get you onboarded with Starter!"
- CELEBRATE their choice
- List Starter features: Website/Facebook/SMS chat, 24/7 appointments, FAQs, alerts, multilingual, dashboard (voice $199/mo add-on)
- Collect: name, email, phone, company_name, company_website
- Use \`schedule_appointment\` for "Starter Plan Kickoff Call"

**IF user says "I want to get started with the Growth plan" (first message):**
- They clicked "Get Started" on **Growth** tier (RECOMMENDED PLAN!)
- EXTRA CELEBRATION (this is the popular one!)
- Frame: "EXCELLENT CHOICE - Growth Plan! Let's fast-track your setup!"
- List Growth features: Everything in Starter + Multi-AI (ChatGPT/Claude/Gemini), brand voice, emotion detection, ecommerce tracking, CRM/POS integration, phone support, lead capture, Zendesk/Salesforce/HubSpot, Instagram/WhatsApp/Messenger/Telegram
- Collect: name, email, phone, company_name, company_website, number_of_locations (optional)
- Use \`schedule_appointment\` for "Growth Plan Onboarding Session"

**IF user says "I want to get started with the Enterprise plan" (first message):**
- They clicked "Get Started" on **Enterprise** tier
- PREMIUM TREATMENT
- Frame: "PREMIUM CHOICE - Enterprise! Let's customize everything!"
- List Enterprise features: Everything in Growth + Dedicated AI models, custom workflows, agentic automation, proactive engagement, custom integrations, priority support, team collaboration, advanced analytics
- Collect: name, email, phone, company_name, company_website, team_size (optional), integration_needs (optional)
- Use \`schedule_appointment\` for "Enterprise Discovery Call"
- Mention custom pricing discussion

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

After collecting ALL information, show them a summary and ask "Does this look good?" or "Ready to book?"

⚠️ **CRITICAL - THE MOMENT OF TRUTH:**
When user confirms (yes/ok/sure/sounds good/etc.) → Your NEXT action is CALLING schedule_appointment function. NOT saying words. CALLING THE FUNCTION.

**You have TWO CHOICES ONLY:**
1. Call schedule_appointment tool (correct) ✅
2. Say "I'll schedule it" without calling the tool (WRONG, this is LYING) ❌

Choose option 1. ALWAYS. Every single time. No exceptions.

**Remember:** The tool call happens FIRST, then you respond with a beautiful HTML success message using the tool's result. Words without action = lying to users = bad AI.

### Support Ticket Process
When a user wants to talk to support or submit a ticket:
1. Offer to submit a ticket and explain that support will respond soon
2. Collect: Name, Email, Phone
3. Ask for: Subject and Description of their concern

After collecting ALL information, use the submit_ticket tool with the details.

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
    
    // Detect if user is confirming (heuristic based on user's latest message)
    const confirmationKeywords = ['yes', 'yeah', 'ok', 'sure', 'sounds good', 'that works', 'perfect', 'confirm', 'go ahead', 'do it', 'schedule it'];
    const userConfirmedAppointment = confirmationKeywords.some(keyword => query.toLowerCase().includes(keyword));
    
    // Check if conversation history shows we've collected appointment info
    const hasAppointmentDetails = history.some(msg => 
      msg.role === 'assistant' && (
        msg.content?.includes('confirm') || 
        msg.content?.includes('schedule') ||
        msg.content?.includes('appointment')
      )
    );
    
    // If user confirmed and we've been discussing appointment, be aggressive with tool calling
    const shouldForceToolCall = userConfirmedAppointment && hasAppointmentDetails;
    
    if (shouldForceToolCall) {
      console.log(`[TEXT CHAT] 🎯 DETECTION: User confirmed appointment. Forcing tool_choice to 'required'`);
    }
    
    // Define tools for OpenAI
    const tools = [
      {
        type: "function",
        function: {
          name: "schedule_appointment",
          description: "IMMEDIATELY schedule an appointment on Google Calendar when you have all required information (name, email, phone, company_name, appointment_datetime) AND the user confirms. Call this function RIGHT AWAY when user says yes/ok/sure/confirm - do NOT respond with text first. The function call IS your response.",
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
      tool_choice: shouldForceToolCall ? "required" : "auto", // Force tool call when user confirms
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

