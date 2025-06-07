import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, IconButton, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: input,
      });

      setMessages([
        ...newMessages,
        { from: "bot", text: res.data.response || "No reply" },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "Error: Could not connect to AI." },
      ]);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6">💬 Chat with AI Assistant</Typography>
      <Box sx={{ maxHeight: 200, overflowY: "auto", my: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: msg.from === "user" ? "right" : "left",
              mb: 1,
              px: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "inline-block",
                background: msg.from === "user" ? "#cce5ff" : "#e2e2e2",
                borderRadius: 2,
                p: 1,
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chatbot;
