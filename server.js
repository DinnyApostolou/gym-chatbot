require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: `You are a helpful assistant for a gym. Answer questions about memberships, classes, hours, and facilities. Keep answers short and friendly.
    
    Gym info:
    - Hours: Mon-Fri 5am-11pm, Sat-Sun 7am-9pm
    - Memberships: Basic $29/mo, Premium $49/mo
    - Classes: Yoga, Spin, HIIT, Zumba
    - Location: 123 Main St`,
    messages: [{ role: 'user', content: message }]
  });
  
  res.json({ reply: response.content[0].text });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(4000, () => console.log('Chatbot running on port 4000'));
