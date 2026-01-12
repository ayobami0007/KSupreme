// const express = require("express");
// const router = express.Router();
// const ClassModel = require("../models/Class");

// // Get all classes (with optional filters)
// router.get("/", async (req, res) => {
//   try {
//     const classes = await ClassModel.getAll(req.query);
//     res.json(classes);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create class (admin)
// // router.post("/", async (req, res) => {
// //   try {
// //    const result = await ClassModel.create(req.body);
// //     res.status(201).json({ id: result.insertId, ...req.body });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // Create class (admin)
// router.post("/", async (req, res) => {
//   // ✅ Validation goes here
//   if (!req.body.name || !req.body.section) {
//     return res.status(400).json({ error: "name and section are required" });
//   }

//   try {
//     const result = await ClassModel.create(req.body);
//     res.status(201).json({ id: result.insertId, ...req.body });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update class
// router.put("/:id", async (req, res) => {
//   try {
//     await ClassModel.update(req.params.id, req.body);
//     res.json({ message: "Class updated" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const ClassModel = require("../models/Class");

// // Get all classes (with optional filters)
// router.get("/", async (req, res) => {
//   try {
//     const classes = await ClassModel.getAll(req.query);
//     res.json(classes);
//   } catch (err) {
//     console.error("Error fetching classes:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// Create class (admin)


// router.post("/", async (req, res) => {
//   const { name, section } = req.body;
//   if (!name || !section) {
//     return res.status(400).json({ error: "name and section are required" });
//   }

//   try {
//     const createdClass = await ClassModel.create(req.body);
//     // Postgres returns the full inserted row
//     res.status(201).json(createdClass);
//   } catch (err) {
//     console.error("Error creating class:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update class
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedClass = await ClassModel.update(req.params.id, req.body);
//     res.json({ message: "Class updated", updatedClass });
//   } catch (err) {
//     console.error("Error updating class:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router()

const ClassModel = require("../models/Class");

// Helper to map errors to status codes
function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("required") || msg.includes("must be") || msg.includes("Invalid")) return 400;
  if (msg.includes("already exists") || msg.includes("duplicate")) return 409;
  if (msg.includes("No class found") || msg.includes("not found")) return 404;
  return 500;
}

// Get all classes (with optional filters)
router.get("/", async (req, res) => {
  try {
    const classes = await ClassModel.getAll(req.query);
    res.json(classes);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ error: "Failed to fetch classes." });
  }
});


router.post("/", async (req, res) => {
  const { name, section, level } = req.body;

  if (!name || !section) {
    return res.status(400).json({ error: "name and section are required" });
  }

  // level required only for Secondary
  if (section === "Secondary" && !level) {
    return res.status(400).json({ error: "level is required for Secondary section" });
  }

  try {
    const createdClass = await ClassModel.create(req.body);
    res.status(201).json(createdClass);
  } catch (err) {
    console.error("Error creating class:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});

// Update class
router.put("/:id", async (req, res) => {
  const { name, section, level } = req.body;

  if (!name || !section) {
    return res.status(400).json({ error: "name and section are required" });
  }

  // level required only for Secondary
  if (section === "Secondary" && !level) {
    return res.status(400).json({ error: "level is required for Secondary section" });
  }

  try {
    const updatedClass = await ClassModel.update(req.params.id, req.body);
    res.json({ message: "Class updated", updatedClass });
  } catch (err) {
    console.error("Error updating class:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
