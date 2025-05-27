const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const { protect } = require("../utils/authMiddleware");


// @route   POST /api/users/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post("/login", loginUser);


// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private

router.get("/profile", protect, async (req, res) => {
  res.json(req.user); // should return logged-in user's info
});

module.exports = router;



