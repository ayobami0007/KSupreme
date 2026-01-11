
const express = require("express");
const router = express.Router();
const Term = require("../models/Term");

// Create a new term
router.post("/", async (req, res) => {
  console.log("Incoming term payload:", req.body);
  const { name, session_id } = req.body;

  if (!name || !session_id) {
    return res.status(400).json({ error: "name and session_id are required" });
  }

  try {
    const result = await Term.create(name, session_id);
    res.status(201).json({ id: result.insertId, name, session_id });
  } catch (err) {
    console.error("Error creating term:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const terms = await Term.getAll();
    res.json(terms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Activate a term
// router.put("/:id/activate", async (req, res) => {
//   const { id } = req.params;
//   // const { session_id } = req.body;

//   if (!session_id) {
//     return res.status(400).json({
//       error: "session_id is required to activate a term"
//     });
//   }

//   try {
//     const term = await Term.setActive(id, session_id);
//     res.json(term);
//   } catch (err) {
//     console.error("Error activating term:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// Activate a term globally
router.put("/:id/activate", async (req, res) => {
  const { id } = req.params;

  try {
    const term = await Term.setActive(id);
    res.json(term);
  } catch (err) {
    console.error("Error activating term:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all terms for a session
router.get("/session/:session_id", async (req, res) => {
  try {
    const terms = await Term.getAllBySession(req.params.session_id);
    res.json(terms);
  } catch (err) {
    console.error("Error fetching terms:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get active term by session
router.get("/active/:session_id", async (req, res) => {
  try {
    const activeTerm = await Term.getActiveBySession(req.params.session_id);
    res.json(activeTerm);
  } catch (err) {
    console.error("Error fetching active term:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
