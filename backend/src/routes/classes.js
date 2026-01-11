const express = require("express");
const router = express.Router();
const ClassModel = require("../models/Class");

// Get all classes (with optional filters)
router.get("/", async (req, res) => {
  try {
    const classes = await ClassModel.getAll(req.query);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create class (admin)
// router.post("/", async (req, res) => {
//   try {
//    const result = await ClassModel.create(req.body);
//     res.status(201).json({ id: result.insertId, ...req.body });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// Create class (admin)
router.post("/", async (req, res) => {
  // ✅ Validation goes here
  if (!req.body.name || !req.body.section) {
    return res.status(400).json({ error: "name and section are required" });
  }

  try {
    const result = await ClassModel.create(req.body);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update class
router.put("/:id", async (req, res) => {
  try {
    await ClassModel.update(req.params.id, req.body);
    res.json({ message: "Class updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
