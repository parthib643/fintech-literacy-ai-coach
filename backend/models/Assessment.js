// models/Assessment.js
const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Assessment", assessmentSchema);
