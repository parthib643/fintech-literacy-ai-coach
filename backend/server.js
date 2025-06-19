const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const moduleRoutes = require("./Routes/moduleRoutes");
const progressRoutes = require("./Routes/progressRoutes");
const assessmentRoutes = require("./Routes/assesmentRoutes");
const aiRoutes = require("./Routes/aiRoutes");
const pathRoutes = require("./Routes/pathRoutes");
const achievementRoutes = require("./Routes/achievementRoutes");
const cors = require('cors');
const path = require("path");
const mongoose = require("mongoose");



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // frontend URL
  credentials: true,
}));
app.use(express.json()); // Body parser

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use("/api/modules", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/ai", aiRoutes); 
app.use("/api", pathRoutes); // Learning Path Route
app.use("/api", achievementRoutes);