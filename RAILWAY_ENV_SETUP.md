# Railway Environment Variables Setup

## ⚠️ CRITICAL: Chat API Endpoint Configuration

The chat API is currently returning **405 error** because the endpoint URL is incorrect.

### **PROBLEM:**
Current config: `https://endpoint-aiprl-main-site.vercel.app/`  
**WRONG!** ❌

### **SOLUTION:**
In Railway, add this environment variable to your **Frontend Service**:

```
VITE_CHAT_API_URL=https://endpoint-aiprl-main-site.vercel.app/api/webhook
```

Note the `/api/webhook` at the end! ✅

---

## Complete Environment Variables for Frontend Service

```env
# Chat API - MUST include /api/webhook
VITE_CHAT_API_URL=https://endpoint-aiprl-main-site.vercel.app/api/webhook
VITE_CHAT_API_TIMEOUT=30000
VITE_CHAT_API_ENABLE_DEBUG=true

# Voice Service URL (your second Railway service)
VITE_VOICE_SERVICE_URL=https://voice-service-production.up.railway.app

# Newsletter
VITE_NEWSLETTER_WEBHOOK_URL=https://app.aiprlassist.com/en/settings?acc=8584189

# Database (Get from your .env file)
DATABASE_URL=postgres://your-database-connection-string

# OpenAI (Get from your .env file)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE
```

---

## Complete Environment Variables for Voice Service

```env
ELEVENLABS_API_KEY=sk_YOUR_ELEVENLABS_KEY_HERE
PORT=3000
```

---

## After Adding Variables:

1. **Restart the Frontend Service** in Railway
2. Wait for the new deployment to finish
3. Test the chat - the 405 error should be gone!

---

## Mobile Voice Modal Fix

The mobile voice modal is now **responsive**:
- **Mobile**: Full screen (100% width & height)
- **Desktop**: 95% width & height with rounded corners

This fix is already in the code!

