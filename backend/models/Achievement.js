const mongoose = require("mongoose");

const achievementSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model("Achievement", achievementSchema);
