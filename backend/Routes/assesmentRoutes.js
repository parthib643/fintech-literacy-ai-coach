const express = require("express");
const router = express.Router();
const {
  getAssessmentByModule,
  submitAssessment
} = require("../controllers/assessmentController");

// GET /api/assessment/:moduleId
router.get("/:moduleId", getAssessmentByModule);

// POST /api/assessment/submit
router.post("/submit", submitAssessment);

module.exports = router;


