const Progress = require("../models/Progress");

// POST /api/progress/update
exports.updateProgress = async (req, res) => {
  const { userId, moduleId, status } = req.body;

  try {
    const updated = await Progress.findOneAndUpdate(
      { user: userId, module: moduleId },
      { status, lastUpdated: Date.now() },
      { new: true, upsert: true }
    ).populate("module", "title");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/progress/:userId
exports.getUserProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    const progress = await Progress.find({ user: userId }).populate("module", "title description level");
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};