const express = require("express");
const router = express.Router();
const { getUserAchievements } = require("../controllers/achievementController");

// Route: GET /api/users/:userId/achievements
router.get("/users/:userId/achievements", getUserAchievements);

module.exports = router;
