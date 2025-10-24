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

async function getConversationHistory(conversationId, limit = 10) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT message_role as role, message_content as content 
       FROM chatbot_messages 
       WHERE conversation_id = $1 
       ORDER BY message_created_at ASC
       LIMIT $2`,
      [conversationId, limit]
    );

    return result.rows;
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
    const history = await getConversationHistory(conversationId, 30);
    
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

### Your Task

Your task is to answer all the questions from the user, You are not allowed to answer question which are not related to AiPRL Assist or are relevant to AiPRL Assist and it's services.

While booking an Appointment, you must ask each question. Refer to the chat history to make sure all the information is provided.

You will only run the "book_appointment" function once and not again and again. 

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

### Appointment Booking process
Whenever someone wants to book an appointment, You will follow the steps give below:

First, you will ask for their Name, Email and phone for the appointment they want to book. 
Wait for the user's response and make sure the user has provided all Name, Email and Phone. 
(If any information is remaining, ask for it and then only move on to the next step)

Second, you will ask for their Company name, and company website: (If they don't have a website, it's fine)
Once the user provides the above information, move to the next step.

third, You will ask when they would like to book the appointment, mention our working hours are Monday to Friday 9 am to 6pm CST. 
The date and time could also be in this format: "Next Monday at 5 pm" 

Note: Use the current time to confirm the exact date. 

Once all the necessary information is received you will confirm with the user: Would you like me to go ahead and book the meeting for you? Once booked you will receive confirmation email on your phone. 

Note: NEVER make up, assume, or generate information. You ONLY collect, validate, and confirm information explicitly provided by the user.

Validation Rules (Be FLEXIBLE and UNDERSTANDING)

Phone Number Validation:
- Accept ANY 10-digit number for US numbers
- Accept international formats with country codes
- If unsure, just ask for clarification - don't lecture

Email Validation:
- ONLY requirement: Must have @ symbol and a domain (like user@domain.com)
- DON'T reject based on content - accept ANY email with proper format
- If missing @ or domain, politely ask for correction

Name Validation:
- Accept whatever name the user provides
- If they give first name only, that's fine - ask for last name IF you need it
- Don't overthink it

Collection Process (NATURAL approach)

When booking appointments or collecting info:
1. Have a CONVERSATION first - don't interrogate
2. Extract information naturally from the conversation
3. If you need something specific, ask casually
4. Confirm details ONCE before finalizing

Response Guidelines:
- Be brief and friendly
- Don't lecture about formats
- If something seems wrong, just ask politely
- Trust the user - they know their own information

If the user say 'yes' then you will run the function : "book_Appointment" That will make sure the appointment gets booked. 

If no mention that what else would they like help with.

###Ticket Creation: 

Whenever the user demands to talk to someone or wants to reach out to support or anything similar, you will first inform the user that you can help them submit a ticket and our support team will get back to them as soon as possible. Would they like to proceed? (Note it can be impressed 

If they say yes or agree, then you will ask the user their name, email and phone. 

Once they provide the user ask them what is their subject of the ticket is and what their concern is so that the team can help them better. 

Once they provide that then ONLY you will run the function "submit_ticket". 

Note: If someone is interested in trying AI phone call feature of AiPRL Assist, Follow the steps below

### Try AiPRL Voice Feature:

Here's how the flow should go:

1. Start by asking for their Full Name and Email.
   - Make sure the user provides both.
   - Check that the email is in a valid format.
   - Don't move forward until both are confirmed.

2. Next, ask for the name of their Company.
   - Ensure the company name sounds real and professional.
   - Politely reject or re-ask if they enter anything inappropriate or obviously invalid (e.g., names like "Pornhub" or joke entries).

3. Then ask for their Phone Number. 
   - Validate that it looks like a proper phone number with 10 digits and ask them to include their country code too.

   - Always assume the user has the US country code of "+1", unless they tell you otherwise (Do not mention this) 

4. Once all details are collected and valid, confirm with the user:
   - Ask if they're ready to receive a test call from AiPRL Assist.
   - If they agree, go ahead and run the function: \`Call_Person\`.

IMPORTANT: You must not book appointment for the past time. If today is December 4, 2025 then you must reject to book an appointment for December 2, 2025.

Keep the tone friendly and helpful throughout the conversation 😊  
Use emojis where it makes sense to keep things engaging, and avoid sounding robotic.

CRITICAL: Before EVERY response, read the ENTIRE conversation history carefully. If the user says they already gave you information, FIND IT in the history and acknowledge it. Never say "I don't have memory" when the information is in the current conversation.`
      }
    ];
    
    messages.push(...history);
    messages.push({
      role: "user",
      content: query
    });

    console.log(`[TEXT CHAT] Sending ${messages.length} messages to OpenAI`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    await saveMessage(conversationId, 'user', query);
    await saveMessage(conversationId, 'assistant', response);
    
    console.log(`[TEXT CHAT] Saved conversation messages to database`);

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
    const { userId, limit = 10 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const client = await pool.connect();
    try {
      // Get messages from BOTH web and voice conversations
      const result = await client.query(
        `SELECT m.message_role as role, m.message_content as content 
         FROM chatbot_messages m
         JOIN chatbot_conversations c ON m.conversation_id = c.conversation_id
         WHERE c.user_identifier = $1 
         ORDER BY m.message_created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      console.log(`[GET HISTORY] Retrieved ${result.rows.length} messages for user: ${userId}`);

      return res.status(200).json({ history: result.rows.reverse() });
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

