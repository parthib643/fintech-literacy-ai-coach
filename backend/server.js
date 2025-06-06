const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');

const userRoutes = require("./Routes/userRoutes");
const moduleRoutes = require("./Routes/moduleRoutes");
const progressRoutes = require("./Routes/progressRoutes");
const assessmentRoutes = require("./Routes/assessmentRoutes");
const achievementRoutes = require("./Routes/achievementRoutes");
const pathRoutes = require("./Routes/pathRoutes");

dotenv.config();
connectDB();





const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // allow frontend origin
  credentials: true, // if you're using cookies or sessions
}));

app.use(express.json()); // Middleware to parse JSON

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api", achievementRoutes); 
app.use("/api", pathRoutes);        

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
