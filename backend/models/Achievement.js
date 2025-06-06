const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  criteria: {
    completedModules: { type: Number, default: 0 }, // Example criterion
    score: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Achievement", achievementSchema);
