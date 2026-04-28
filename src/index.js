require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Chatbot = require('./chatbot');

const app = express();
const port = process.env.PORT || 8080;

// --- Security: HTTP headers ---
app.use(helmet({
  contentSecurityPolicy: false // Allow inline styles/scripts from React build
}));

// --- Security: Rate limiting ---
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20,                  // 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' }
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.static(path.join(__dirname, '../client/dist')));

// --- In-memory session store with TTL cleanup ---
const sessions = new Map();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Purge stale sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

app.post('/api/chat', async (req, res) => {
  try {
    let { sessionId, message, language = 'English' } = req.body;

    // --- Input validation ---
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long. Please keep it under 1000 characters.' });
    }
    if (typeof language !== 'string' || language.length > 30) {
      language = 'English';
    }

    if (!sessionId || !sessions.has(sessionId)) {
      sessionId = crypto.randomUUID();
      sessions.set(sessionId, { bot: new Chatbot(), lastActive: Date.now() });
    }

    const session = sessions.get(sessionId);
    session.lastActive = Date.now();
    const bot = session.bot;

    let reply;

    if (message === '/start') {
      reply = await bot.handleInput(`Introduce yourself warmly in ${language} as VoterSphere. You help with Indian election info, polling booths, and dates. Keep it brief and friendly.`);
    } else {
      reply = await bot.handleInput(`[Respond in ${language}] ${message}`);
    }

    res.json({ sessionId, reply });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`VoterSphere web server listening on port ${port}`);
});
