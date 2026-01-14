
// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// router.get("/payments", async (req, res) => {
//   try {
//     const { status, section, level, track } = req.query;

//     // 1 Active term (use boolean)
//     const termResult = await db.query(
//       "SELECT id FROM terms WHERE is_active = true LIMIT 1"
//     );
//     const term = termResult.rows[0];
//     if (!term) return res.status(404).json({ error: "No active term" });

//     // 2 Build WHERE filters (place BEFORE GROUP BY)
//     let whereClauses = [`sf.term_id = $1`]; // school_fees term
//     let values = [term.id]; // $1
//     let paramIndex = 2; // next placeholder index

//     if (section) {
//       whereClauses.push(`c.section = $${paramIndex}`);
//       values.push(section);
//       paramIndex++;
//     }
//     if (level) {
//       whereClauses.push(`c.level = $${paramIndex}`);
//       values.push(level);
//       paramIndex++;
//     }
//     if (track) {
//       whereClauses.push(`c.track = $${paramIndex}`);
//       values.push(track);
//       paramIndex++;
//     }

//     const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

//     // 3 Status HAVING condition (normalize status)
//     const s = (status || "").toUpperCase();
//     let havingSQL = "";
//     if (s === "FULL") {
//       havingSQL = `HAVING (sf.amount - COALESCE(SUM(p.amount_paid),0)) <= 0`;
//     } else if (s === "OWING") {
//       havingSQL = `HAVING (sf.amount - COALESCE(SUM(p.amount_paid),0)) > 0`;
//     }

//     // 4 Main query: WHERE -> GROUP BY -> HAVING -> ORDER BY
//     const query = `
//       SELECT 
//         s.id AS student_id,
//         s.name AS student_name,
//         c.name AS class_name,
//         c.section,
//         c.level,
//         c.track,
//         sf.amount AS total_fee,
//         COALESCE(SUM(p.amount_paid), 0) AS total_paid,
//         (sf.amount - COALESCE(SUM(p.amount_paid), 0)) AS balance
//       FROM students s
//       JOIN classes c ON s.class_id = c.id
//       JOIN school_fees sf ON sf.class_id = c.id
//       LEFT JOIN payments p 
//         ON p.student_id = s.id 
//         AND p.class_id = c.id 
//         AND p.term_id = $1
//       ${whereSQL}
//       GROUP BY s.id, s.name, c.name, c.section, c.level, c.track, sf.amount
//       ${havingSQL}
//       ORDER BY c.name, s.name
//     `;

//     const result = await db.query(query, values);
//     res.json(result.rows);

//   } catch (err) {
//     console.error("Payments dashboard error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/reports/recent-payments
router.get("/recent-payments", async (req, res) => {
  try {
    // 1️⃣ Get active term
    const termResult = await db.query(
      "SELECT id FROM terms WHERE is_active = true LIMIT 1"
    );
    const activeTerm = termResult.rows[0];
    if (!activeTerm) {
      return res.status(404).json({ error: "No active term found" });
    }

    // 2️⃣ Query recent payments (last 20 by date)
    const query = `
      SELECT 
        p.id,
        s.name AS student_name,
        c.name AS class_name,
        p.amount_paid,
        p.payment_mode,
        p.created_at,
        sf.amount AS total_fee,
        COALESCE(SUM(p2.amount_paid),0) AS total_paid,
        (sf.amount - COALESCE(SUM(p2.amount_paid),0)) AS balance
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN classes c ON p.class_id = c.id
      JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = p.term_id
      LEFT JOIN payments p2 
        ON p2.student_id = s.id AND p2.class_id = c.id AND p2.term_id = p.term_id
      WHERE p.term_id = $1
      GROUP BY p.id, s.name, c.name, p.amount_paid, p.payment_mode, p.created_at, sf.amount
      ORDER BY p.created_at DESC
      LIMIT 20;
    `;

    const result = await db.query(query, [activeTerm.id]);

    // 3️⃣ Map into frontend-friendly format
    const payments = result.rows.map(r => ({
      name: r.student_name,
      class: r.class_name,
      amount: r.amount_paid,
      mode: r.payment_mode,
      date: r.created_at,
      status: r.balance <= 0 ? "FULL" : "OWING"
    }));

    res.json(payments);
  } catch (err) {
    console.error("Recent payments error:", err);
    res.status(500).json({ error: "Failed to fetch recent payments" });
  }
});

module.exports = router;
