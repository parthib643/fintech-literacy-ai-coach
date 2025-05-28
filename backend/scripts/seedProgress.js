const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Progress = require("../models/Progress");
const User = require("../models/User");
const Module = require("../models/Module");

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Progress.deleteMany();

  const user = await User.findOne(); // assumes at least one user exists
  const modules = await Module.find();

  if (!user || modules.length === 0) {
    throw new Error("Missing users or modules. Make sure both are seeded.");
  }

  const progressData = modules.map((mod, index) => ({
    user: user._id,
    module: mod._id,
    status: index % 2 === 0 ? "completed" : "in progress"
  }));

  const inserted = await Progress.insertMany(progressData);
  console.log("Progress records seeded:", inserted.length);
  process.exit();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
