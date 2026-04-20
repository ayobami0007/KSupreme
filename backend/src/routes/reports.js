


// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// // GET /api/reports/recent-payments
// router.get("/recent-payments", async (req, res) => {
//   try {
//     // 1️⃣ Get active term
//     const termResult = await db.query(
//       "SELECT id FROM terms WHERE is_active = true LIMIT 1"
//     );
//     const activeTerm = termResult.rows[0];
//     if (!activeTerm) {
//       return res.status(404).json({ error: "No active term found" });
//     }

//     // 2️⃣ Query recent payments (last 20 by date)
//     const query = `
//       SELECT 
//         p.id,
//         s.name AS student_name,
//         c.name AS class_name,
//         p.amount_paid,
//         p.payment_mode,
//         p.created_at,
//         sf.amount AS total_fee,
//         COALESCE(SUM(p2.amount_paid),0) AS total_paid,
//         (sf.amount - COALESCE(SUM(p2.amount_paid),0)) AS balance
//       FROM payments p
//       JOIN students s ON p.student_id = s.id
//       JOIN classes c ON p.class_id = c.id
//       JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = p.term_id
//       LEFT JOIN payments p2 
//         ON p2.student_id = s.id AND p2.class_id = c.id AND p2.term_id = p.term_id
//       WHERE p.term_id = $1
//       GROUP BY p.id, s.name, c.name, p.amount_paid, p.payment_mode, p.created_at, sf.amount
//       ORDER BY p.created_at DESC
//       LIMIT 20;
//     `;

//     const result = await db.query(query, [activeTerm.id]);

//     // 3️⃣ Map into frontend-friendly format
//     const payments = result.rows.map(r => ({
//       name: r.student_name,
//       class: r.class_name,
//       amount: r.amount_paid,
//       mode: r.payment_mode,
//       date: r.created_at,
//       status: r.balance <= 0 ? "FULL" : "OWING"
//     }));

//     res.json(payments);
//   } catch (err) {
//     console.error("Recent payments error:", err);
//     res.status(500).json({ error: "Failed to fetch recent payments" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ---------------------------------------------------------------------------
// GET /api/reports/recent-payments
// FIX 1: Removed separate active-term round-trip — folded into CTE
// FIX 2: Replaced self-join on payments (ran once per row) with a
//         pre-aggregated CTE joined once
// ---------------------------------------------------------------------------
router.get("/recent-payments", async (req, res) => {
  try {
    const result = await db.query(`
      WITH active_term AS (
        SELECT id FROM terms WHERE is_active = true LIMIT 1
      ),
      student_totals AS (
        -- Aggregate total paid per student once, not once per result row
        SELECT
          student_id,
          class_id,
          SUM(amount_paid) AS total_paid
        FROM payments
        WHERE term_id = (SELECT id FROM active_term)
        GROUP BY student_id, class_id
      )
      SELECT
        p.id,
        s.name                                              AS student_name,
        c.name                                              AS class_name,
        p.amount_paid,
        p.payment_mode,
        p.created_at,
        COALESCE(sf.amount, 0)                              AS total_fee,
        COALESCE(st.total_paid, 0)                          AS total_paid,
        COALESCE(sf.amount, 0) - COALESCE(st.total_paid, 0) AS balance
      FROM payments p
      JOIN students s     ON p.student_id = s.id
      JOIN classes c      ON p.class_id   = c.id
      CROSS JOIN active_term at
      LEFT JOIN school_fees sf
        ON sf.class_id = c.id AND sf.term_id = at.id
      LEFT JOIN student_totals st
        ON st.student_id = p.student_id AND st.class_id = p.class_id
      WHERE p.term_id = at.id
      ORDER BY p.created_at DESC NULLS LAST
      LIMIT 20
    `);

    const payments = result.rows.map(r => ({
      name:   r.student_name,
      class:  r.class_name,
      amount: r.amount_paid,
      mode:   r.payment_mode || "—",
      date:   r.created_at,
      status: Number(r.balance) <= 0 ? "FULL" : "OWING",
    }));

    res.json(payments);
  } catch (err) {
    console.error("Recent payments error:", err);
    res.status(500).json({ error: "Failed to fetch recent payments" });
  }
});

module.exports = router;