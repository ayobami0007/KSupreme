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


// Get students with payment status for active term
router.get("/with-status", async (req, res) => {
  try {
    const { class_id, term_id, search } = req.query;

    const query = `
      SELECT 
        s.id,
        s.name,
        c.name AS class,
        COALESCE(SUM(p.amount_paid), 0) AS total_paid,
        sf.amount AS total_fee,
        CASE 
          WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount THEN 'Paid'
          ELSE 'Owing'
        END AS status
      FROM students s
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN payments p ON p.student_id = s.id AND p.term_id = $1
      LEFT JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = $1
      WHERE ($2::int IS NULL OR s.class_id = $2)
        AND ($3::text IS NULL OR s.name ILIKE '%' || $3 || '%' OR s.id ILIKE '%' || $3 || '%')
      GROUP BY s.id, s.name, c.name, sf.amount
      ORDER BY s.name ASC;
    `;

    const values = [term_id, class_id || null, search || null];
    const result = await db.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students with status:", err);
    res.status(500).json({ error: "Failed to fetch students with status" });
  }
});


module.exports = router;
