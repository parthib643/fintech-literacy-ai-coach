const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

// @route   POST /api/users/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post("/login", loginUser);

module.exports = router;
