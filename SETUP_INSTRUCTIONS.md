# 🚀 Quick Setup Instructions

## Step 1: Create `.env.local` File

The `.env.local` file is gitignored. Create it manually:

```bash
cp env.local.example .env.local
```

Or create it with this content:

```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000

# Chat API Configuration
VITE_CHAT_API_URL=https://endpoint-aiprl-main-site.vercel.app/
VITE_CHAT_API_TIMEOUT=30000
VITE_CHAT_API_ENABLE_DEBUG=true

# Firebase Configuration (add your actual values)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Step 2: Install Dependencies (if needed)

```bash
pnpm install
```

---

## Step 3: Run Development Server

```bash
pnpm dev
```

---

## Step 4: Test the Implementation

### Test Text Chat:
1. Open browser to `http://localhost:5173` (or your dev URL)
2. Open DevTools → Console
3. Look for: `[UserIdentity] Created new userId: user_...`
4. (Chat is currently commented out - see below to enable)

### Test Voice Agent:
1. Click "Talk to Aiprl" button
2. Check console: `Voice Agent userId: user_...`
3. The userId should match the one from text chat!

---

## Step 5: Enable Chat Widget (Optional)

To enable the text chat widget, edit:
`src/Components/HeroSection/index.tsx`

```diff
  <section id="resources" className="scroll-mt-28">
    <Newsletter />
  </section>

- {/* <section id="contact" className="scroll-mt-28"> */}
-   {/* <ChatbotWidget />  */}
-   {/* <ChatbotDock /> */}
- {/* </section> */}
+ <section id="contact" className="scroll-mt-28">
+   <ChatbotDock />
+ </section>
```

---

## Step 6: Update Voice Agent

In your `voice-test-rings.html`, add this code to extract userId:

```javascript
// Get userId from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

console.log('Voice Agent userId:', userId);

// Use it in your webhook calls
// See VOICE_AGENT_USERID_EXAMPLE.md for detailed examples
```

---

## ✅ Verification Checklist

- [ ] `.env.local` file created
- [ ] `VITE_CHAT_API_URL` points to your endpoint
- [ ] Dev server running
- [ ] Console shows userId being generated
- [ ] Text chat sends userId in payload
- [ ] Voice agent receives userId via URL
- [ ] Memory persists across page refresh

---

## 🎯 What You Have Now

**Frontend (Complete ✅):**
- Persistent userId generation
- Text chat integration
- Voice agent integration
- Environment configuration
- Debug logging

**Backend (Already Working ✅):**
- Your Vercel function accepts `{ query, userId }`
- PostgreSQL stores conversations
- Memory management working

**Next Step (Your Side):**
- Update `voice-test-rings.html` to use the userId parameter
- See `VOICE_AGENT_USERID_EXAMPLE.md` for examples

---

## 📚 Documentation Reference

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_SUMMARY.md` | Complete overview |
| `USER_IDENTITY_IMPLEMENTATION.md` | Detailed technical guide |
| `VOICE_AGENT_USERID_EXAMPLE.md` | Voice agent code examples |
| `SETUP_INSTRUCTIONS.md` | This file! Quick start |

---

## 🐛 Troubleshooting

**Problem: "VITE_CHAT_API_URL is not defined"**
- Solution: Make sure `.env.local` exists and has the correct variables

**Problem: "userId is undefined in voice agent"**
- Solution: Check browser console, verify URL includes `?userId=...`

**Problem: "Memory not persisting"**
- Solution: Check localStorage in DevTools → Application → Local Storage

**Problem: "CORS error"**
- Solution: Your backend already has CORS enabled (`Access-Control-Allow-Origin: *`)

---

## 🎉 You're Ready!

Everything is set up. Start the dev server and test it out!

```bash
pnpm dev
```

Then open http://localhost:5173 and check the console for debug logs.



