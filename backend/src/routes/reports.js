// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");


// router.get("/payments", async (req, res) => {
//   try {
//     const { status, section, level, track } = req.query;

//     // Active term
//     const [[term]] = await db.query(
//       "SELECT id FROM terms WHERE is_active=1 LIMIT 1"
//     );

//     if (!term) return res.status(404).json({ error: "No active term" });

//     let filters = [];
//     let values = [term.id];

//     if (section) {
//       filters.push("c.section = ?");
//       values.push(section);
//     }

//     if (level) {
//       filters.push("c.level = ?");
//       values.push(level);
//     }

//     if (track) {
//       filters.push("c.track = ?");
//       values.push(track);
//     }

//     const filterSQL = filters.length ? "AND " + filters.join(" AND ") : "";

//     const [rows] = await db.query(
//       `
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
//       JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = ?
//       LEFT JOIN payments p 
//         ON p.student_id = s.id 
//         AND p.class_id = c.id 
//         AND p.term_id = ?
//       GROUP BY s.id
//       HAVING 
//         ${
//           status === "FULL"
//             ? "balance <= 0"
//             : status === "OWING"
//             ? "balance > 0"
//             : "1=1"
//         }
//       ${filterSQL}
//       `,
//       [term.id, term.id, ...values.slice(1)]
//     );

//     res.json(rows);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/payments", async (req, res) => {
  try {
    const { status, section, level, track } = req.query;

    // 1️⃣ Active term
    const termResult = await db.query(
      "SELECT id FROM terms WHERE is_active=1 LIMIT 1"
    );
    const term = termResult.rows[0];
    if (!term) return res.status(404).json({ error: "No active term" });

    // 2️⃣ Filters
    let filters = [];
    let values = [term.id, term.id]; // for sf.term_id and p.term_id
    let paramIndex = 3; // start numbering for optional filters

    if (section) {
      filters.push(`c.section = $${paramIndex}`);
      values.push(section);
      paramIndex++;
    }
    if (level) {
      filters.push(`c.level = $${paramIndex}`);
      values.push(level);
      paramIndex++;
    }
    if (track) {
      filters.push(`c.track = $${paramIndex}`);
      values.push(track);
      paramIndex++;
    }

    const filterSQL = filters.length ? "AND " + filters.join(" AND ") : "";

    // 3️⃣ Status HAVING condition
    let havingSQL = "";
    if (status === "FULL") {
      havingSQL = `HAVING (sf.amount - COALESCE(SUM(p.amount_paid),0)) <= 0`;
    } else if (status === "OWING") {
      havingSQL = `HAVING (sf.amount - COALESCE(SUM(p.amount_paid),0)) > 0`;
    }

    // 4️⃣ Main query
    const query = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        c.name AS class_name,
        c.section,
        c.level,
        c.track,
        sf.amount AS total_fee,
        COALESCE(SUM(p.amount_paid), 0) AS total_paid,
        (sf.amount - COALESCE(SUM(p.amount_paid), 0)) AS balance
      FROM students s
      JOIN classes c ON s.class_id = c.id
      JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = $1
      LEFT JOIN payments p 
        ON p.student_id = s.id 
        AND p.class_id = c.id 
        AND p.term_id = $2
      GROUP BY s.id, s.name, c.name, c.section, c.level, c.track, sf.amount
      ${havingSQL}
      ${filterSQL}
    `;

    const result = await db.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error("Payments dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
