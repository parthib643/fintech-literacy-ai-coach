const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Assessment = require("../models/Assessment");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const moduleId = "6836d8d2f974e004793bf3c3"; // ← Replace with actual module ObjectId

    const questions = [
      {
        questionText: "What does FinTech stand for?",
        options: ["Finance Technology", "Financial Tools", "Technology Funds", "Future Tech"],
        correctAnswer: "Finance Technology"
      },
      {
        questionText: "Which is a blockchain-based currency?",
        options: ["Bitcoin", "PayPal", "Visa", "Stripe"],
        correctAnswer: "Bitcoin"
      }
    ];

    await Assessment.create({ module: moduleId, questions });
    console.log("Mock assessment inserted");
    process.exit();
  })
  .catch((err) => {
    console.error("Error seeding assessment:", err);
    process.exit(1);
  });
