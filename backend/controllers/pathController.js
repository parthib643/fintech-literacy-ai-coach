// pathController.js
const User = require('../models/User'); // Assuming a User model exists

// Dummy path levels
const paths = ["Beginner", "Intermediate", "Advanced"];

const getUserLearningPath = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get user data (e.g., progress or score from DB)
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Logic to determine path level
    let level = "Beginner";

    if (user.completedModules >= 5 && user.score >= 50) {
      level = "Intermediate";
    }

    if (user.completedModules >= 10 && user.score >= 80) {
      level = "Advanced";
    }

    // 3. Return personalized path
    res.json({
      userId,
      suggestedPath: level,
      nextSteps: getNextSteps(level)
    });

  } catch (error) {
    console.error("Error fetching user path:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function: Suggest next content
function getNextSteps(level) {
  switch (level) {
    case "Beginner":
      return ["Complete basics of FinTech", "Finish at least 5 modules", "Target 50%+ score"];
    case "Intermediate":
      return ["Take quizzes", "Start intermediate case studies", "Aim for 80%+"];
    case "Advanced":
      return ["Build a project", "Mentor others", "Take certification tests"];
    default:
      return [];
  }
}

module.exports = {
  getUserLearningPath
};
