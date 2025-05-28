const Module = require("../models/Module");

// GET /api/modules - list all modules
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find({});
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/modules/:id - fetch a single module
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
