require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve ElevenLabs UMD client via backend route
app.get('/elevenlabs-client.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'node_modules', '@elevenlabs', 'client', 'dist', 'lib.umd.js'));
});

// Serve root-level assets that are not under /public
app.get('/girl.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'girl.png'));
});

// Signed URL proxy endpoint
app.post('/api/elevenlabs/signed-url', async (req, res) => {
  try {
    const agentId = req.body?.agentId;
    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY not configured' });
    }
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `ElevenLabs error ${response.status}` });
    }
    const data = await response.json();
    return res.json({ signedUrl: data.signed_url });
  } catch (err) {
    console.error('signed-url error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Optional: add CSP for iframe embedding of the main page
function setEmbedHeaders(res) {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://woodstock-technical-chatbot-full-fe.vercel.app");
  res.setHeader('Permissions-Policy', 'microphone=(self "https://woodstock-technical-chatbot-full-fe.vercel.app"), autoplay=(self "https://woodstock-technical-chatbot-full-fe.vercel.app")');
}

app.get('/voice-test-rings.html', (req, res) => {
  setEmbedHeaders(res);
  res.sendFile(path.join(__dirname, 'public', 'voice-test-rings.html'));
});

app.get('/voice-rings', (req, res) => {
  setEmbedHeaders(res);
  res.sendFile(path.join(__dirname, 'public', 'voice-test-rings.html'));
});

// Root
app.get('/', (req, res) => {
  res.redirect('/voice-test-rings.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Standalone ElevenLabs voice app listening on :${PORT}`));


