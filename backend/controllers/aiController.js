const openai = require("../config/openaiConfig");

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo", // or "gpt-4"
    });

    const aiResponse = completion.choices[0].message.content;
    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
};

module.exports = { chatWithAI };
