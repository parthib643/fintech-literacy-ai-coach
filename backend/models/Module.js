const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Module", moduleSchema);
