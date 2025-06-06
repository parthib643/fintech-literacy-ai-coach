
const express = require('express');
const router = express.Router();
const { getUserLearningPath } = require('../controllers/pathController');

// Route: GET /api/paths/:userId
router.get('/paths/:userId', getUserLearningPath);

module.exports = router;
