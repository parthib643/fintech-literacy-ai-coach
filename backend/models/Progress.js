const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  status: { type: String, enum: ["not started", "in progress", "completed"], default: "not started" },
  lastUpdated: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
