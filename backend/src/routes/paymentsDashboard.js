// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");
// const PaymentModel = require("../models/Payment");

// // GET /api/payments/dashboard/:student_id
// router.get("/:student_id", async (req, res) => {
//   const { student_id } = req.params;

//   try {
//     // 1️⃣ Get student info
//     const [[student]] = await db.query(
//       "SELECT s.id, s.name, s.class_id, c.name AS class_name " +
//       "FROM students s JOIN classes c ON s.class_id = c.id WHERE s.id = ?",
//       [student_id]
//     );

//     if (!student) return res.status(404).json({ error: "Student not found" });

//     // 2️⃣ Get active term
//     const [[activeTerm]] = await db.query(
//       "SELECT * FROM terms WHERE is_active=1 LIMIT 1"
//     );

//     if (!activeTerm) return res.status(404).json({ error: "No active term found" });

//     // 3️⃣ Get class fee for this term
//     const [[fee]] = await db.query(
//       "SELECT amount FROM school_fees WHERE class_id=? AND term_id=?",
//       [student.class_id, activeTerm.id]
//     );

//     const totalFee = fee ? fee.amount : 0;

//     // 4️⃣ Get total paid
//     const totalPaid = await PaymentModel.getTotalPaid(
//       student.id,
//       student.class_id,
//       activeTerm.id
//     );

//     const balance = totalFee - totalPaid;

//     // 5️⃣ Payment history
//     const [payments] = await db.query(
//       "SELECT * FROM payments WHERE student_id=? AND class_id=? AND term_id=? ORDER BY created_at DESC",
//       [student.id, student.class_id, activeTerm.id]
//     );

//     res.json({
//       student,
//       term: activeTerm,
//       total_fee: totalFee,
//       total_paid: totalPaid,
//       balance,
//       status: balance === 0 ? "FULL" : "PART",
//       payments
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // GET /api/payments/dashboard/:student_id







const express = require("express");
const router = express.Router();
const db = require("../config/db");
const PaymentModel = require("../models/Payment");

 router.get("/:student_id", async (req, res) => {
  const id = parseInt(req.params.student_id, 10);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "student_id must be an integer" });

  try {
    // 1 Get student info
    const studentResult = await db.query(
      `SELECT s.id, s.name, s.class_id, c.name AS class_name
       FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE s.id = $1`,
      [id]
    );
    const student = studentResult.rows[0];
    if (!student) return res.status(404).json({ error: "Student not found" });

    // 2 Get active term (use boolean true for safety)
    const activeTermResult = await db.query(
      "SELECT * FROM terms WHERE is_active = true LIMIT 1"
    );
    const activeTerm = activeTermResult.rows[0];
    if (!activeTerm) return res.status(404).json({ error: "No active term found" });

    // 3 Get class fee for this term
    const feeResult = await db.query(
      "SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2",
      [student.class_id, activeTerm.id]
    );
    const fee = feeResult.rows[0];
    const totalFee = fee ? Number(fee.amount) : 0;

    // 4 Get total paid (ensure numeric)
    const totalPaidRaw = await PaymentModel.getTotalPaid(student.id, student.class_id, activeTerm.id);
    const totalPaid = Number(totalPaidRaw) || 0;
    const balance = totalFee - totalPaid;

    // 5 Payment history (fallback to id if created_at missing)
    const paymentsResult = await db.query(
      "SELECT * FROM payments WHERE student_id=$1 AND class_id=$2 AND term_id=$3 ORDER BY created_at DESC NULLS LAST, id DESC",
      [student.id, student.class_id, activeTerm.id]
    );
    const payments = paymentsResult.rows || [];

    res.json({
      student,
      term: activeTerm,
      total_fee: totalFee,
      total_paid: totalPaid,
      balance,
      status: balance === 0 ? "FULL" : "PART",
      fee_exists: !!fee,
      payments
    });

  } catch (err) {
    console.error("Dashboard error:", { student_id: id, err });
    res.status(500).json({ error: "Failed to build student dashboard" });
  }
});

// GET /api/payments/dashboard → all students with pagination
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Get active term
    const termResult = await db.query(
      "SELECT id FROM terms WHERE is_active = true LIMIT 1"
    );
    const activeTerm = termResult.rows[0];
    if (!activeTerm) {
      return res.status(404).json({ error: "No active term found" });
    }

    // 2️⃣ Pagination params (defaults: page=1, limit=20)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    // 3️⃣ Get active students with class info (paged)
    const studentsResult = await db.query(
      `SELECT s.id, s.name, s.class_id, c.name AS class_name
       FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE s.status = 'Active'
       ORDER BY s.id
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const students = studentsResult.rows;

    // 4️⃣ Build dashboards for each student
    const dashboards = [];
    for (const student of students) {
      // Fee for this class+term
      const feeResult = await db.query(
        "SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2",
        [student.class_id, activeTerm.id]
      );
      const fee = feeResult.rows[0];
      const totalFee = fee ? Number(fee.amount) : 0;

      // Total paid
      const totalPaidRaw = await PaymentModel.getTotalPaid(
        student.id,
        student.class_id,
        activeTerm.id
      );
      const totalPaid = Number(totalPaidRaw) || 0;
      const balance = totalFee - totalPaid;

      // Payment history
      const paymentsResult = await db.query(
        "SELECT * FROM payments WHERE student_id=$1 AND class_id=$2 AND term_id=$3 ORDER BY created_at DESC NULLS LAST, id DESC",
        [student.id, student.class_id, activeTerm.id]
      );

      dashboards.push({
        student,
        term: activeTerm,
        total_fee: totalFee,
        total_paid: totalPaid,
        balance,
        status: balance === 0 ? "FULL" : "PART",
        fee_exists: !!fee,
        payments: paymentsResult.rows || []
      });
    }

    // 5️⃣ Get total count of active students for pagination metadata
    const countResult = await db.query(
      "SELECT COUNT(*) AS total FROM students WHERE status = 'Active'"
    );
    const totalStudents = parseInt(countResult.rows[0].total, 10);

    res.json({
      page,
      limit,
      total_students: totalStudents,
      total_pages: Math.ceil(totalStudents / limit),
      dashboards
    });
  } catch (err) {
    console.error("All dashboards error:", err);
    res.status(500).json({ error: "Failed to build dashboards" });
  }
});

module.exports = router;
