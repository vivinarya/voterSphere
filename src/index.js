require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Chatbot = require('./chatbot');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Simple in-memory session store for Chatbot instances
const sessions = new Map();

app.post('/api/chat', async (req, res) => {
  let { sessionId, message, language = 'English' } = req.body;
  
  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = crypto.randomUUID();
    sessions.set(sessionId, new Chatbot());
  }

  const bot = sessions.get(sessionId);
  let reply;

  if (message === '/start') {
    reply = await bot.handleInput(`Introduce yourself warmly in ${language} as VoterSphere. You help with Indian election info, polling booths, and dates. Keep it brief and friendly.`);
  } else {
    reply = await bot.handleInput(`[Respond in ${language}] ${message}`);
  }

  res.json({ sessionId, reply });
});

app.listen(port, () => {
  console.log(`VoterSphere web server listening on port ${port}`);
});
