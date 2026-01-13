
// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// // Dashboard summary endpoint
// router.get("/summary", async (req, res) => {
//   try {
//     // 1 Total students (active only)
//     const studentsResult = await db.query(
//       "SELECT COUNT(*) AS total_students FROM students WHERE status = 'Active'"
//     );
//     const totalStudents = parseInt(studentsResult.rows[0].total_students || 0, 10);

//     // 2 Fully paid students (distinct students who have at least one class+term fully paid)
//     const fullyPaidSql = `
//       SELECT COUNT(DISTINCT student_id) AS fully_paid
//       FROM (
//         SELECT p.student_id,
//                p.class_id,
//                p.term_id,
//                SUM(p.amount_paid) AS paid,
//                MAX(f.amount) AS fee
//         FROM payments p
//         JOIN school_fees f
//           ON p.class_id = f.class_id
//          AND p.term_id  = f.term_id
//         GROUP BY p.student_id, p.class_id, p.term_id
//         HAVING SUM(p.amount_paid) >= MAX(f.amount)
//       ) t;
//     `;
//     const fullyPaidResult = await db.query(fullyPaidSql);
//     const fullyPaidCount = parseInt(fullyPaidResult.rows[0].fully_paid || 0, 10);

//     // 3 Total amount collected
//     const amountResult = await db.query(
//       "SELECT COALESCE(SUM(amount_paid),0) AS total_amount FROM payments"
//     );
//     const totalAmount = parseFloat(amountResult.rows[0].total_amount || 0);

//     // 4 Owing students = total - fully paid
//     const owingCount = Math.max(0, totalStudents - fullyPaidCount);

//     res.json({
//       total_students: totalStudents,
//       fully_paid: fullyPaidCount,
//       owing: owingCount,
//       total_amount: totalAmount,
//     });
//   } catch (err) {
//     console.error("Dashboard summary error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Dashboard summary endpoint
router.get("/summary", async (req, res) => {
  try {
    // 1️⃣ Get active term
    const termResult = await db.query(
      "SELECT id FROM terms WHERE is_active = true LIMIT 1"
    );
    const activeTerm = termResult.rows[0];
    if (!activeTerm) {
      return res.status(404).json({ error: "No active term found" });
    }

    // 2️⃣ Total students (active only, in this term)
    const studentsResult = await db.query(
      "SELECT COUNT(*) AS total_students FROM students WHERE status = 'Active'"
    );
    const totalStudents = parseInt(studentsResult.rows[0].total_students || 0, 10);

    // 3️⃣ Fully paid students (for their class fee in the active term)
    const fullyPaidSql = `
      SELECT COUNT(DISTINCT p.student_id) AS fully_paid
      FROM payments p
      JOIN school_fees f
        ON p.class_id = f.class_id
       AND p.term_id  = f.term_id
      WHERE p.term_id = $1
      GROUP BY p.student_id, p.class_id, p.term_id
      HAVING SUM(p.amount_paid) >= MAX(f.amount);
    `;
    const fullyPaidResult = await db.query(fullyPaidSql, [activeTerm.id]);
    const fullyPaidCount =
      fullyPaidResult.rows.length > 0
        ? parseInt(fullyPaidResult.rows[0].fully_paid || 0, 10)
        : 0;

    // 4️⃣ Total amount collected (active term only)
    const amountResult = await db.query(
      "SELECT COALESCE(SUM(amount_paid),0) AS total_amount FROM payments WHERE term_id = $1",
      [activeTerm.id]
    );
    const totalAmount = parseFloat(amountResult.rows[0].total_amount || 0);

    // 5️⃣ Owing students = total - fully paid
    const owingCount = Math.max(0, totalStudents - fullyPaidCount);

    res.json({
      term_id: activeTerm.id,
      total_students: totalStudents,
      fully_paid: fullyPaidCount,
      owing: owingCount,
      total_amount: totalAmount,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
