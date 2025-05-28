const express = require("express");
const router = express.Router();
const { updateProgress, getUserProgress } = require("../controllers/progressController");

// POST /api/progress/update
router.post("/update", updateProgress);

// GET /api/progress/:userId
router.get("/:userId", getUserProgress);

module.exports = router;
