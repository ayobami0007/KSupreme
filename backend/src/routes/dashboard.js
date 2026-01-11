


const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Dashboard summary endpoint
router.get("/summary", async (req, res) => {
  try {
    // 1️⃣ Total students (active only)
    const [students] = await db.query(
      "SELECT COUNT(*) AS total_students FROM students WHERE status='Active'"
    );

    // 2️⃣ Fully paid students (balance = 0)
    const [fullyPaid] = await db.query(`
      SELECT COUNT(DISTINCT p.student_id) AS fully_paid
      FROM payments p
      JOIN school_fees f ON p.class_id = f.class_id AND p.term_id = f.term_id
      GROUP BY p.student_id, p.class_id, p.term_id
      HAVING SUM(p.amount_paid) >= MAX(f.amount)
    `);

    // 3️⃣ Total amount collected
    const [amount] = await db.query(
      "SELECT COALESCE(SUM(amount_paid),0) AS total_amount FROM payments"
    );

    // 4️⃣ Owing students = total - fully paid
    const totalStudents = students[0].total_students;
    const fullyPaidCount = fullyPaid.length > 0 ? fullyPaid[0].fully_paid : 0;
    const owingCount = totalStudents - fullyPaidCount;

    res.json({
      total_students: totalStudents,
      fully_paid: fullyPaidCount,
      owing: owingCount,
      total_amount: amount[0].total_amount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
