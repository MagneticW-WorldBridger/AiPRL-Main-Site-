# Voice Agent - userId Integration Example

## 📞 How to Extract and Use userId in Your Voice Agent

This guide shows you how to update your `voice-test-rings.html` or ElevenLabs implementation to use the shared `userId`.

---

## 🔧 Quick Implementation

### **Add to your `voice-test-rings.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AiPRL Voice Assistant</title>
</head>
<body>
    <div id="voice-container">
        <!-- Your ElevenLabs widget here -->
    </div>

    <script>
        // ============================================
        // STEP 1: Extract userId from URL
        // ============================================
        function getUserIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            
            console.log('🔑 Voice Agent - Received userId:', userId);
            
            return userId || 'anonymous';
        }

        const userId = getUserIdFromUrl();

        // ============================================
        // STEP 2: Initialize ElevenLabs Conversation
        // ============================================
        // Example with ElevenLabs Conversation SDK
        const conversationConfig = {
            agentId: "your-agent-id-here",
            
            // Pass userId to your webhook
            overrides: {
                agent: {
                    prompt: {
                        prompt: `Your system prompt here. User ID: ${userId}`
                    },
                    
                    // Your webhook configuration
                    webhook: {
                        url: "https://endpoint-aiprl-main-site.vercel.app/",
                        method: "POST",
                        
                        // Include userId in every request
                        body: {
                            userId: userId,
                            platformType: "voice"
                        }
                    }
                }
            }
        };

        // ============================================
        // STEP 3: Handle Messages
        // ============================================
        async function sendMessageToBackend(userMessage) {
            try {
                const response = await fetch('https://endpoint-aiprl-main-site.vercel.app/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: userMessage,
                        userId: userId,
                        platformType: 'voice'
                    })
                });

                const data = await response.json();
                console.log('✅ Backend response:', data);
                
                return data[0]?.output;
            } catch (error) {
                console.error('❌ Error:', error);
            }
        }

        // ============================================
        // STEP 4: Debug Info (Optional)
        // ============================================
        console.log('📋 Voice Agent Configuration:', {
            userId: userId,
            endpoint: 'https://endpoint-aiprl-main-site.vercel.app/',
            platformType: 'voice'
        });
    </script>
</body>
</html>
```

---

## 🎯 Option 1: ElevenLabs Conversational AI (Recommended)

If you're using the ElevenLabs Conversational AI SDK:

```javascript
import { Conversation } from "@11labs/client";

// Extract userId from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId') || 'anonymous';

// Initialize conversation with userId
const conversation = await Conversation.startSession({
    agentId: "your-agent-id",
    
    // Override settings to include userId
    overrides: {
        agent: {
            webhook: {
                url: "https://endpoint-aiprl-main-site.vercel.app/",
                body: JSON.stringify({
                    userId: userId,
                    platformType: "voice"
                })
            }
        }
    },
    
    // Callback when user speaks
    onMessage: (message) => {
        console.log("User said:", message);
    },
    
    // Callback when agent responds
    onStatusChange: (status) => {
        console.log("Status:", status);
    }
});

// Start listening
conversation.startListening();
```

---

## 🎯 Option 2: Custom Webhook Integration

If you have a custom voice implementation:

```javascript
// voice-handler.js

class VoiceAgentHandler {
    constructor() {
        // Get userId from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.userId = urlParams.get('userId') || 'anonymous';
        this.endpoint = 'https://endpoint-aiprl-main-site.vercel.app/';
        
        console.log('🎤 Voice Agent initialized with userId:', this.userId);
    }
    
    async sendMessage(userMessage) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: userMessage,
                    userId: this.userId,
                    platformType: 'voice'
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data[0]?.output;
            
            console.log('✅ AI Response:', aiResponse);
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            throw error;
        }
    }
    
    getUserInfo() {
        return {
            userId: this.userId,
            endpoint: this.endpoint,
            platform: 'voice'
        };
    }
}

// Usage
const voiceAgent = new VoiceAgentHandler();

// When user speaks, send to backend
async function handleUserSpeech(transcript) {
    const aiResponse = await voiceAgent.sendMessage(transcript);
    // Speak the AI response back to user
    speakResponse(aiResponse);
}
```

---

## 🧪 Testing Your Implementation

### **Step 1: Check URL Parameters**
```javascript
// Add this temporarily to verify userId is being received
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    console.log('🔍 All URL parameters:', {
        embed: params.get('embed'),
        theme: params.get('theme'),
        userId: params.get('userId')
    });
});
```

### **Step 2: Test Payload**
Open your browser console when using voice agent:
```
🔑 Voice Agent - Received userId: user_1729876543210_abc123xyz
📤 Sending to backend: {
    query: "Hello",
    userId: "user_1729876543210_abc123xyz",
    platformType: "voice"
}
✅ Backend response: [{
    output: "Hi! How can I help you?",
    conversationId: "uuid-123"
}]
```

### **Step 3: Verify Memory**
1. Open website → Chat via text: "My name is John"
2. AI responds: "Nice to meet you, John!"
3. Click "Talk to Aiprl" → Voice
4. Say: "What's my name?"
5. AI should respond: "Your name is John!" 🎉

---

## 📡 Backend Payload Structure

Your backend will receive:

```json
{
  "query": "What are your pricing plans?",
  "userId": "user_1729876543210_abc123xyz",
  "platformType": "voice"
}
```

The backend handler (your Vercel function) already handles this:
```javascript
const { query, userId, platformType = 'web' } = req.body;

const userIdentifier = userId || 
    req.headers['x-forwarded-for'] || 
    'anonymous';

const conversationId = await getOrCreateConversation(
    userIdentifier, 
    platformType
);
```

---

## 🎨 URL Format Reference

When the voice popup opens, the iframe URL looks like:

```
http://localhost:3000/voice-test-rings.html
  ?embed=1
  &theme=dark
  &userId=user_1729876543210_abc123xyz
```

Parse it with:
```javascript
const params = new URLSearchParams(window.location.search);
const embed = params.get('embed');      // "1"
const theme = params.get('theme');      // "dark"
const userId = params.get('userId');    // "user_1729876543210_abc123xyz"
```

---

## 🚀 Quick Start Checklist

- [ ] Extract `userId` from URL parameters
- [ ] Include `userId` in webhook payload
- [ ] Add `platformType: 'voice'` (optional)
- [ ] Test with console.log to verify userId is received
- [ ] Test memory: chat via text, then voice
- [ ] Verify conversationId is shared across platforms

---

## 🆘 Troubleshooting

### **Problem: userId is undefined**
```javascript
// Check if parameter is being passed
console.log('Full URL:', window.location.href);
console.log('Search params:', window.location.search);
```

**Solution:** Make sure the iframe URL includes `userId` parameter.

### **Problem: Memory not persisting**
```javascript
// Check if the same userId is being used
console.log('Text chat userId:', localStorage.getItem('aiprl_user_id'));
console.log('Voice agent userId:', new URLSearchParams(window.location.search).get('userId'));
```

**Solution:** They should match!

### **Problem: Backend not receiving userId**
```javascript
// Log the exact payload being sent
const payload = { query, userId, platformType: 'voice' };
console.log('📤 Payload:', JSON.stringify(payload, null, 2));
```

---

## ✅ Summary

Your voice agent now needs to:
1. ✅ Extract `userId` from URL: `?userId=user_...`
2. ✅ Include it in every request to your backend
3. ✅ Backend will automatically link conversations
4. ✅ Users get persistent memory across text and voice!

**That's it! Your cross-channel memory is now working!** 🎉



