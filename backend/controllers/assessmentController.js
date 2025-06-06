// controllers/assessmentController.js
const Assessment = require("../models/Assessment");
const Submission = require("../models/Submission");

// GET /api/assessment/:moduleId
exports.getAssessmentByModule = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ module: req.params.moduleId });

    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/assessment/submit
exports.submitAssessment = async (req, res) => {
  const { userId, moduleId, answers } = req.body;

  try {
    const submission = await Submission.create({ user: userId, module: moduleId, answers });
    res.status(201).json({ message: "Assessment submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
