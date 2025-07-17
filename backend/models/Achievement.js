// models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  criteria: {
    completedModules: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Achievement", achievementSchema);
