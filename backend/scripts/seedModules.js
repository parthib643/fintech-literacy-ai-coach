const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Module = require("../models/Module");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");

    await Module.deleteMany();

    const modules = [
      {
        title: "Introduction to FinTech",
        description: "Learn the basics of financial technology.",
        level: "Beginner",
        tags: ["fintech", "basics"]
      },
      {
        title: "Blockchain Fundamentals",
        description: "Understand the technology behind cryptocurrency.",
        level: "Intermediate",
        tags: ["blockchain", "crypto"]
      },
      {
        title: "AI in Financial Services",
        description: "Explore how AI is revolutionizing finance.",
        level: "Advanced",
        tags: ["AI", "machine learning", "finance"]
      }
    ];

    await Module.insertMany(modules);
    console.log("Mock modules inserted");
    process.exit();
  })
  .catch((err) => {
    console.error("DB Error:", err);
    process.exit(1);
  });
