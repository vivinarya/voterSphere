require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Chatbot = require('./chatbot');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Simple in-memory session store for Chatbot instances
const sessions = new Map();

app.post('/api/chat', async (req, res) => {
  let { sessionId, message } = req.body;
  
  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = crypto.randomUUID();
    sessions.set(sessionId, new Chatbot());
  }

  const bot = sessions.get(sessionId);
  let reply;

  if (message === '/start') {
    reply = "Welcome to VoterSphere! I am your AI Civic Assistant.\n\nI'm here to demystify the election process, help you find polling stations, create calendar reminders, or answer any questions you have about voting. How can I help you today?";
  } else {
    reply = await bot.handleInput(message);
  }

  res.json({ sessionId, reply });
});

app.listen(port, () => {
  console.log(`VoterSphere web server listening on port ${port}`);
});
