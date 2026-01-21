const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("required") || msg.includes("must") || msg.includes("At least")) return 400;
  if (msg.includes("does not exist") || msg.includes("No student found")) return 404;
  if (msg.includes("already exists") || msg.includes("duplicate")) return 409;
  return 500;
}

// Get students (Bursar view / filtered)
router.get("/", async (req, res) => {
  try {
    const { class_id, section, level, track, search, status } = req.query;
    const students = await Student.getAll({ class_id, section, level, track, search, status });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});

// Admin add student
router.post("/", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json({ message: "Student added", student: newStudent });
  } catch (err) {
    console.error("Error creating student:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});

// Admin edit student
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.update(req.params.id, req.body);
    res.json({ message: "Student updated", student: updated });
  } catch (err) {
    console.error("Error updating student:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});



router.get("/with-status", async (req, res) => {
  try {
    const { class_id, search, status, limit, offset } = req.query;

    const students = await Student.getWithStatus({
      class_id: class_id ? parseInt(class_id) : null,
      search: search || "",
      status: status || "", 
      limit: limit ? parseInt(limit) : 30,
      offset: offset ? parseInt(offset) : 0
    });

    res.json(students);
  } catch (err) {
    console.error("Error fetching students with status:", err);
    res.status(500).json({ error: err.message });
  }
});






module.exports = router;
