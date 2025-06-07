const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Module = require('../models/Module');
const Assessment = require('../models/Assessment');
const Achievement = require('../models/Achievement');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedModules = [
  {
    title: "Introduction to Finance",
    description: "Basics of financial literacy",
    level: "Beginner",
    content: "This module introduces the basics of saving, budgeting, and spending."
    
  },
  {
    title: "Investing 101",
    description: "Understanding stock markets and mutual funds",
    level: "Intermediate",
    content: "Explains the fundamentals of investing and how to start with mutual funds."
  },
  {
    title: "Advanced Crypto Finance",
    description: "Deep dive into blockchain and DeFi",
    level: "Advanced",
    content: "Covers smart contracts, crypto wallets, and decentralized finance."
  }
];

const seedAssessments = [
  {
    module: '', // <-- this will be replaced with a Module _id
    questions: [
      {
        questionText: "What is budgeting?",
        options: ["Spending all your money", "Planning your expenses", "Saving only", "None of the above"],
        correctAnswer: "Planning your expenses"
      }
    ]
  }
];


const seedAchievements = [
  {
    title: "Completed 1 Module",
    description: "Awarded for completing your first module."
  },
  {
    title: "Finance Explorer",
    description: "Awarded after completing all beginner modules."
  }
];

const importData = async () => {
    console.log("🚀 Running seed script...");
  try {
    await Module.deleteMany();
    await Assessment.deleteMany();
    await Achievement.deleteMany();

    const createdModules = await Module.insertMany(seedModules);

    seedAssessments[0].module = createdModules[0]._id;

    await Assessment.insertMany(seedAssessments);
    await Achievement.insertMany(seedAchievements);

    console.log("✅ Dummy data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

importData();
