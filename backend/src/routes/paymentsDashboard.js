

// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");
// const PaymentModel = require("../models/Payment");

//  router.get("/:student_id", async (req, res) => {
//   const id = parseInt(req.params.student_id, 10);
//   if (!Number.isInteger(id)) return res.status(400).json({ error: "student_id must be an integer" });

//   try {
//     // 1 Get student info
//     const studentResult = await db.query(
//       `SELECT s.id, s.name, s.class_id, c.name AS class_name
//        FROM students s
//        JOIN classes c ON s.class_id = c.id
//        WHERE s.id = $1`,
//       [id]
//     );
//     const student = studentResult.rows[0];
//     if (!student) return res.status(404).json({ error: "Student not found" });

//     // 2 Get active term (using boolean )
//     const activeTermResult = await db.query(
//       "SELECT * FROM terms WHERE is_active = true LIMIT 1"
//     );
//     const activeTerm = activeTermResult.rows[0];
//     if (!activeTerm) return res.status(404).json({ error: "No active term found" });

//     // 3 Get class fee for this term
//     const feeResult = await db.query(
//       "SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2",
//       [student.class_id, activeTerm.id]
//     );
//     const fee = feeResult.rows[0];
//     const totalFee = fee ? Number(fee.amount) : 0;

//     // 4 Get total paid (ensure numeric)
//     const totalPaidRaw = await PaymentModel.getTotalPaid(student.id, student.class_id, activeTerm.id);
//     const totalPaid = Number(totalPaidRaw) || 0;
//     const balance = totalFee - totalPaid;

//     // 5 Payment history (fallback to id if created_at missing)
//     const paymentsResult = await db.query(
//       "SELECT * FROM payments WHERE student_id=$1 AND class_id=$2 AND term_id=$3 ORDER BY created_at DESC NULLS LAST, id DESC",
//       [student.id, student.class_id, activeTerm.id]
//     );
//     const payments = paymentsResult.rows || [];

//     res.json({
//       student,
//       term: activeTerm,
//       total_fee: totalFee,
//       total_paid: totalPaid,
//       balance,
//       status: balance === 0 ? "FULL" : "PART",
//       fee_exists: !!fee,
//       payments
//     });

//   } catch (err) {
//     console.error("Dashboard error:", { student_id: id, err });
//     res.status(500).json({ error: "Failed to build student dashboard" });
//   }
// });

// // GET /api/payments/dashboard → all students with pagination
// router.get("/", async (req, res) => {
//   try {
//     // 1️⃣ Get active term
//     const termResult = await db.query(
//       "SELECT id FROM terms WHERE is_active = true LIMIT 1"
//     );
//     const activeTerm = termResult.rows[0];
//     if (!activeTerm) {
//       return res.status(404).json({ error: "No active term found" });
//     }

//     // 2️⃣ Pagination params (defaults: page=1, limit=20)
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 20;
//     const offset = (page - 1) * limit;

//     // 3️⃣ Get active students with class info 
//     const studentsResult = await db.query(
//       `SELECT s.id, s.name, s.class_id, c.name AS class_name
//        FROM students s
//        JOIN classes c ON s.class_id = c.id
//        WHERE s.status = 'Active'
//        ORDER BY s.id
//        LIMIT $1 OFFSET $2`,
//       [limit, offset]
//     );
//     const students = studentsResult.rows;

//     // 4️⃣ Build dashboards for each student
//     const dashboards = [];
//     for (const student of students) {
//       // Fee for this class+term
//       const feeResult = await db.query(
//         "SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2",
//         [student.class_id, activeTerm.id]
//       );
//       const fee = feeResult.rows[0];
//       const totalFee = fee ? Number(fee.amount) : 0;

//       // Total paid
//       const totalPaidRaw = await PaymentModel.getTotalPaid(
//         student.id,
//         student.class_id,
//         activeTerm.id
//       );
//       const totalPaid = Number(totalPaidRaw) || 0;
//       const balance = totalFee - totalPaid;

//       // Payment history
//       const paymentsResult = await db.query(
//         "SELECT * FROM payments WHERE student_id=$1 AND class_id=$2 AND term_id=$3 ORDER BY created_at DESC NULLS LAST, id DESC",
//         [student.id, student.class_id, activeTerm.id]
//       );

//       dashboards.push({
//         student,
//         term: activeTerm,
//         total_fee: totalFee,
//         total_paid: totalPaid,
//         balance,
//         status: balance === 0 ? "FULL" : "PART",
//         fee_exists: !!fee,
//         payments: paymentsResult.rows || []
//       });
//     }

//     // 5️⃣ Get total count of active students for pagination metadata
//     const countResult = await db.query(
//       "SELECT COUNT(*) AS total FROM students WHERE status = 'Active'"
//     );
//     const totalStudents = parseInt(countResult.rows[0].total, 10);

//     res.json({
//       page,
//       limit,
//       total_students: totalStudents,
//       total_pages: Math.ceil(totalStudents / limit),
//       dashboards
//     });
//   } catch (err) {
//     console.error("All dashboards error:", err);
//     res.status(500).json({ error: "Failed to build dashboards" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ---------------------------------------------------------------------------
// GET /api/dashboard  — all active students with payment info (paginated)
// FIX: was firing 3 DB queries per student inside a for-loop (N+1).
//      Now resolved in a single aggregation query.
// NOTE: specific route registered BEFORE /:student_id wildcard
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit  = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const offset = (page - 1) * limit;

    // Single query: active term + all student dashboards + total count
    const result = await db.query(
      `WITH active_term AS (
         SELECT id FROM terms WHERE is_active = true LIMIT 1
       ),
       student_totals AS (
         SELECT
           p.student_id,
           p.class_id,
           SUM(p.amount_paid) AS total_paid
         FROM payments p
         WHERE p.term_id = (SELECT id FROM active_term)
         GROUP BY p.student_id, p.class_id
       )
       SELECT
         s.id,
         s.name,
         s.class_id,
         c.name                                     AS class_name,
         at.id                                      AS term_id,
         COALESCE(sf.amount, 0)                     AS total_fee,
         COALESCE(st.total_paid, 0)                 AS total_paid,
         COALESCE(sf.amount, 0) - COALESCE(st.total_paid, 0) AS balance,
         (sf.amount IS NOT NULL)                    AS fee_exists,
         COUNT(*) OVER ()                           AS full_count
       FROM students s
       JOIN classes c        ON s.class_id = c.id
       CROSS JOIN active_term at
       LEFT JOIN school_fees sf
         ON sf.class_id = s.class_id AND sf.term_id = at.id
       LEFT JOIN student_totals st
         ON st.student_id = s.id AND st.class_id = s.class_id
       WHERE s.status = 'Active'
       ORDER BY s.id
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const rows          = result.rows;
    const totalStudents = rows.length > 0 ? parseInt(rows[0].full_count, 10) : 0;
    const termId        = rows.length > 0 ? rows[0].term_id : null;

    if (termId === null) {
      return res.status(404).json({ error: "No active term found" });
    }

    // Fetch payment histories for this page of students in one query
    const studentIds = rows.map(r => r.id);
    let paymentsByStudent = {};

    if (studentIds.length > 0) {
      const paymentsRes = await db.query(
        `SELECT * FROM payments
         WHERE student_id = ANY($1::int[])
           AND term_id = $2
         ORDER BY created_at DESC NULLS LAST, id DESC`,
        [studentIds, termId]
      );
      for (const p of paymentsRes.rows) {
        if (!paymentsByStudent[p.student_id]) paymentsByStudent[p.student_id] = [];
        paymentsByStudent[p.student_id].push(p);
      }
    }

    const dashboards = rows.map(r => ({
      student:    { id: r.id, name: r.name, class_id: r.class_id, class_name: r.class_name },
      term_id:    termId,
      total_fee:  Number(r.total_fee),
      total_paid: Number(r.total_paid),
      balance:    Number(r.balance),
      status:     Number(r.balance) === 0 ? "FULL" : "PART",
      fee_exists: r.fee_exists,
      payments:   paymentsByStudent[r.id] || [],
    }));

    res.json({
      page,
      limit,
      total_students: totalStudents,
      total_pages:    Math.ceil(totalStudents / limit),
      dashboards,
    });
  } catch (err) {
    console.error("All dashboards error:", err);
    res.status(500).json({ error: "Failed to build dashboards" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/dashboard/:student_id  — single student dashboard
// FIX: was 4 sequential queries — now 2 (student+fee+paid in one, then history)
// NOTE: wildcard route registered AFTER the "/" route above
// ---------------------------------------------------------------------------
router.get("/:student_id", async (req, res) => {
  const id = parseInt(req.params.student_id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "student_id must be an integer" });
  }

  try {
    // Single query: student info + active term + fee + total paid
    const infoRes = await db.query(
      `WITH active_term AS (
         SELECT id FROM terms WHERE is_active = true LIMIT 1
       ),
       student_paid AS (
         SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
         FROM payments
         WHERE student_id = $1
           AND class_id   = (SELECT class_id FROM students WHERE id = $1)
           AND term_id    = (SELECT id FROM active_term)
       )
       SELECT
         s.id,
         s.name,
         s.class_id,
         c.name                              AS class_name,
         at.id                               AS term_id,
         COALESCE(sf.amount, 0)              AS total_fee,
         (sf.amount IS NOT NULL)             AS fee_exists,
         sp.total_paid
       FROM students s
       JOIN classes c       ON s.class_id = c.id
       CROSS JOIN active_term at
       LEFT JOIN school_fees sf
         ON sf.class_id = s.class_id AND sf.term_id = at.id
       CROSS JOIN student_paid sp
       WHERE s.id = $1`,
      [id]
    );

    const row = infoRes.rows[0];
    if (!row) return res.status(404).json({ error: "Student not found" });
    if (!row.term_id) return res.status(404).json({ error: "No active term found" });

    const totalFee  = Number(row.total_fee);
    const totalPaid = Number(row.total_paid);
    const balance   = totalFee - totalPaid;

    // Payment history — separate query (different shape of data)
    const paymentsRes = await db.query(
      `SELECT * FROM payments
       WHERE student_id = $1 AND class_id = $2 AND term_id = $3
       ORDER BY created_at DESC NULLS LAST, id DESC`,
      [id, row.class_id, row.term_id]
    );

    res.json({
      student:    { id: row.id, name: row.name, class_id: row.class_id, class_name: row.class_name },
      term:       { id: row.term_id },
      total_fee:  totalFee,
      total_paid: totalPaid,
      balance,
      status:     balance === 0 ? "FULL" : "PART",
      fee_exists: row.fee_exists,
      payments:   paymentsRes.rows,
    });
  } catch (err) {
    console.error("Dashboard error:", { student_id: id, err });
    res.status(500).json({ error: "Failed to build student dashboard" });
  }
});

module.exports = router;