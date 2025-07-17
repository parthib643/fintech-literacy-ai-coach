const User = require("../models/User");
const Achievement = require("../models/Achievement");

const getUserAchievements = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const achievements = await Achievement.find();

    const unlocked = achievements.filter((ach) => {
      const moduleCriteria = ach.criteria?.completedModules || 0;
      const scoreCriteria = ach.criteria?.score || 0;

      const meetsModule = (user.completedModules || 0) >= moduleCriteria;
      const meetsScore = (user.score || 0) >= scoreCriteria;

      return meetsModule && meetsScore;
    });

    res.json({
      userId,
      unlockedAchievements: unlocked.map((a) => ({
        title: a.title,
        description: a.description,
      })),
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserAchievements };
