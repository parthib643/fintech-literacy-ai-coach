const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/chat", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5005/chat", {
      message: req.body.message,
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ error: "Chatbot service error" });
  }
});

module.exports = router;


/*
run this part when openai api key is set
const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Add your API key to .env file
});
const openai = new OpenAIApi(configuration);

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini", // or "gpt-4", "gpt-3.5-turbo"
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const response = completion.data.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI API request failed" });
  }
});

module.exports = router;

*/