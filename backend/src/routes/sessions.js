const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Create session
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Session.create(name);
    res.json({ message: "Session created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.getAll();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate session
router.put("/:id/activate", async (req, res) => {
  try {
    await Session.setActive(req.params.id);
    res.json({ message: "Session activated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active session
router.get("/active", async (req, res) => {
  try {
    const active = await Session.getActive();
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
