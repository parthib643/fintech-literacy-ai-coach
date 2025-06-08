const express = require("express");
const router = express.Router();
const {
  getAssessmentByModule,
  submitAssessment
} = require("../controllers/assessmentController");

// POST /api/assessment/submit
router.post("/submit", submitAssessment);

// GET /api/assessment/:moduleId
router.get("/:moduleId", getAssessmentByModule);



module.exports = router;


