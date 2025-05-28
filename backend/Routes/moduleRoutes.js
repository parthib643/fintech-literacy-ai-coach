const express = require("express");
const router = express.Router();
const { getAllModules, getModuleById } = require("../controllers/moduleController");

// @route GET /api/modules
router.get("/", getAllModules);

// @route GET /api/modules/:id
router.get("/:id", getModuleById);

module.exports = router;
