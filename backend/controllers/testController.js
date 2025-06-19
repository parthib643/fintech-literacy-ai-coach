const { submitAssessment } = require("../controllers/assessmentController");

// mock data
const req = {
  body: {
    userId: "user123",
    moduleId: "68454ca1d3837311c351b2ff",
    answers: [
      {
        questionId: "68455e28d3837311c351b310",
        selectedAnswer: "Finance Technology"
      }
    ]
  }
};

const res = {
  status: (code) => ({
    json: (data) => console.log(`STATUS: ${code}`, data)
  })
};

submitAssessment(req, res);
