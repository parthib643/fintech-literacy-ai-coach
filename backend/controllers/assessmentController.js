const Assessment = require("../models/Assessment");
const Submission = require("../models/Submission");

exports.getAssessmentByModule = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const assessment = await Assessment.findOne({ module: moduleId });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAssessment = async (req, res) => {
  const { userId, moduleId, answers } = req.body;

  try {
    const assessment = await Assessment.findOne({ module: moduleId });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    let score = 0;
    const feedback = [];

    answers.forEach((answer) => {
      const question = assessment.questions.id(answer.questionId);
      if (question) {
        const isCorrect =
          question.correctAnswer.trim().toLowerCase() ===
          answer.selectedAnswer.trim().toLowerCase();

        if (isCorrect) score++;

        feedback.push({
          questionText: question.questionText,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
        });
      }
    });

    const submission = await Submission.create({
      userId,
      moduleId,
      answers,
      score,
      submittedAt: new Date(),
    });

    res.status(201).json({
      message: "Assessment submitted successfully",
      score,
      total: assessment.questions.length,
      feedback,
      submissionId: submission._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
