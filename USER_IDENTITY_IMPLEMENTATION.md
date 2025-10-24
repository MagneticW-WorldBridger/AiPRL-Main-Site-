# User Identity & Memory Implementation Guide

## 🎯 Overview

Your AiPRL site now has **persistent user identity** that works across both:
- ✅ **Text Chat** (ChatbotDock component)
- ✅ **Voice Agent** (ElevenLabs implementation)

Both channels now share the **same `userId`**, so users have consistent memory whether they chat via text or voice.

---

## 📡 Current Endpoint & Payload

### **Endpoint Being Called**
```
https://endpoint-aiprl-main-site.vercel.app/
```

### **Request Payload** (Text Chat)
```json
{
  "query": "User's message here",
  "userId": "user_1729876543210_abc123xyz"
}
```

### **Response Expected**
```json
[
  {
    "output": "AI response here in HTML format",
    "conversationId": "uuid-from-database"
  }
]
```

---

## 🔑 How `userId` Works

### **1. User Identity Generation**
- Located in: `src/utils/userIdentity.ts`
- Generates format: `user_{timestamp}_{random}`
- Example: `user_1729876543210_abc123xyz`
- **Stored in**: `localStorage` with key `aiprl_user_id`
- **Persistence**: Survives browser refresh, shared across tabs

### **2. Text Chat Integration**
- File: `src/services/chatApi.ts`
- Gets `userId` before each API call
- Includes it in payload: `{ query, userId }`
- Stores `conversationId` returned from backend

### **3. Voice Agent Integration**
- File: `src/Components/VoiceAgent/VoicePopup.tsx`
- Gets same `userId` from localStorage
- Passes it via URL parameter: `?userId=user_...`
- Your voice agent receives it and can use it for memory

---

## 🛠️ Voice Agent Implementation

In your `voice-test-rings.html` (ElevenLabs implementation), you need to:

### **1. Extract userId from URL**
```javascript
// Add this to your voice-test-rings.html
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

console.log('Voice Agent userId:', userId);
```

### **2. Pass userId to Your Webhook**
When the voice agent makes calls to your backend, include the `userId`:

```javascript
// In your ElevenLabs conversation config or webhook
{
  "conversationConfig": {
    "agent": {
      "firstMessage": "Hello! How can I help you today?",
      "model": {
        "provider": "openai",
        "model": "gpt-4",
        "messages": [
          {
            "role": "system",
            "content": "Your system prompt here..."
          }
        ]
      },
      "serverUrl": "https://endpoint-aiprl-main-site.vercel.app/",
      "serverUrlPayload": {
        "userId": userId  // Pass the same userId
      }
    }
  }
}
```

---

## 📊 Memory Flow

### **Scenario: User interacts with both text and voice**

1. **User opens website**
   - `getUserId()` is called
   - If new: generates `user_1729876543210_abc123xyz`
   - Stores in localStorage

2. **User chats via text**
   ```json
   POST https://endpoint-aiprl-main-site.vercel.app/
   {
     "query": "What are your pricing plans?",
     "userId": "user_1729876543210_abc123xyz"
   }
   ```
   - Backend creates/retrieves conversation
   - Returns conversationId
   - Stores messages in PostgreSQL

3. **User clicks "Talk to Aiprl" (voice)**
   - Opens VoicePopup modal
   - Iframe loads with: `?userId=user_1729876543210_abc123xyz`
   - Voice agent gets same userId
   - Can access same conversation history!

4. **Backend (Your Vercel Function)**
   ```javascript
   // In your handler function
   const { query, userId } = req.body;
   const conversationId = await getOrCreateConversation(userId);
   const history = await getConversationHistory(conversationId);
   // User sees context from both text and voice chats!
   ```

---

## 🎨 Environment Setup

### **Required `.env.local` Variables**
```bash
# Chat API Configuration
VITE_CHAT_API_URL=https://endpoint-aiprl-main-site.vercel.app/
VITE_CHAT_API_TIMEOUT=30000
VITE_CHAT_API_ENABLE_DEBUG=true
```

---

## 🧪 Testing the Implementation

### **1. Test Text Chat with Debug Mode**
```bash
# In your .env.local
VITE_CHAT_API_ENABLE_DEBUG=true
```

Open browser console and look for:
```
[UserIdentity] Created new userId: user_1729876543210_abc123xyz
[ChatApi] Sending query to API: Hello
[ChatApi] Using userId: user_1729876543210_abc123xyz
[ChatApi] Received API response: ...
[ChatApi] ConversationId: uuid-from-db
```

### **2. Test Voice Agent**
```javascript
// In your voice-test-rings.html, add:
console.log('URL params:', window.location.search);
const urlParams = new URLSearchParams(window.location.search);
console.log('userId received:', urlParams.get('userId'));
```

### **3. Test Memory Persistence**
1. Open website → Chat via text
2. Ask: "What's your pricing?"
3. AI responds
4. Click "Talk to Aiprl" → Use voice
5. Say: "What did I just ask you?"
6. AI should remember the text conversation! 🎉

---

## 🔧 Backend Compatibility

Your backend code is **already compatible**! You have:

```javascript
const { query, userId } = req.body;

// Use provided userId or generate from IP
const userIdentifier = userId || 
  req.headers['x-forwarded-for'] || 
  req.connection.remoteAddress || 
  'anonymous';

const conversationId = await getOrCreateConversation(userIdentifier);
```

**What changed:**
- ✅ Frontend now ALWAYS sends `userId`
- ✅ Backend stores it with `userIdentifier` 
- ✅ Same userId used for text and voice
- ✅ Conversation history shared across channels

---

## 🚀 Next Steps

### **For Voice Agent Integration:**

1. **Update your `voice-test-rings.html`** to extract userId:
   ```javascript
   const urlParams = new URLSearchParams(window.location.search);
   const userId = urlParams.get('userId');
   ```

2. **Pass it to your webhook** in the ElevenLabs config:
   ```javascript
   serverUrlPayload: {
     userId: userId,
     platformType: 'voice'  // Optional: to distinguish channels
   }
   ```

3. **Update backend if needed** to accept `platformType`:
   ```javascript
   const { query, userId, platformType = 'web' } = req.body;
   const conversationId = await getOrCreateConversation(userId, platformType);
   ```

---

## 📱 Advanced: Platform Type Tracking

You can optionally track which channel users are using:

### **Text Chat Payload:**
```json
{
  "query": "Hello",
  "userId": "user_123",
  "platformType": "web"
}
```

### **Voice Agent Payload:**
```json
{
  "query": "Hello",
  "userId": "user_123",
  "platformType": "voice"
}
```

This lets you:
- Track which channel is more popular
- Adjust AI responses based on channel
- Generate analytics per platform

---

## 🐛 Debugging Tips

### **Check userId in Console**
```javascript
import { getUserIdentityInfo } from './utils/userIdentity';

console.log(getUserIdentityInfo());
// { userId: "user_...", conversationId: "uuid-..." }
```

### **Clear Identity for Testing**
```javascript
import { clearUserIdentity } from './utils/userIdentity';

clearUserIdentity();
// Simulates a new user
```

### **Check Network Tab**
- Open DevTools → Network
- Send a chat message
- Click the request to `endpoint-aiprl-main-site.vercel.app`
- View **Payload** tab - should see `userId`

---

## ✅ Summary

| Component | Status | File Location |
|-----------|--------|---------------|
| User Identity Utils | ✅ Created | `src/utils/userIdentity.ts` |
| Text Chat Integration | ✅ Updated | `src/services/chatApi.ts` |
| Voice Agent Integration | ✅ Updated | `src/Components/VoiceAgent/VoicePopup.tsx` |
| Backend Compatible | ✅ Already Works | Your Vercel function |
| Environment Config | ✅ Updated | `env.local.example` |

**Your implementation is COMPLETE for the frontend side!**

The only remaining step is updating your `voice-test-rings.html` to extract and use the `userId` parameter. 🎉

