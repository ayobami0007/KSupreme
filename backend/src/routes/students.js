// const express = require("express");
// const router = express.Router();
// const Student = require("../models/Student");

// // Bursar view (filtered)
// // router.get("/", async (req, res) => {
// //   try {
// //     const students = await Student.getAll(req.query);
// //     res.json(students);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// router.get("/", async (req, res) => {
//   try {
//     const { class_id, search } = req.query;
//     const students = await Student.getAll({ class_id, search, status: "Active" });
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // Admin add student
// router.post("/", async (req, res) => {
//   try {
//     await Student.create(req.body);
//     res.status(201).json({ message: "Student added" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Admin edit student
// router.put("/:id", async (req, res) => {
//   try {
//     await Student.update(req.params.id, req.body);
//     res.json({ message: "Student updated" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Get students (Bursar view / filtered)
router.get("/", async (req, res) => {
  try {
    const { class_id, search } = req.query;
    const students = await Student.getAll({ class_id, search, status: "Active" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin add student
router.post("/", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body); // expects model to return inserted row
    res.status(201).json({ message: "Student added", student: newStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin edit student
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.update(req.params.id, req.body); // model should return updated row or success
    res.json({ message: "Student updated", student: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
