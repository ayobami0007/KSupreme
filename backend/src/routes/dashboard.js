

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
    // const fullyPaidSql = `
    //   SELECT COUNT(DISTINCT p.student_id) AS fully_paid
    //   FROM payments p
    //   JOIN school_fees f
    //     ON p.class_id = f.class_id
    //    AND p.term_id  = f.term_id
    //   WHERE p.term_id = $1
    //   GROUP BY p.student_id, p.class_id, p.term_id
    //   HAVING SUM(p.amount_paid) >= MAX(f.amount);
    // `;

     const fullyPaidSql =
  `  SELECT COUNT(*) AS fully_paid
FROM (
  SELECT p.student_id
  FROM payments p
  JOIN school_fees f
    ON p.class_id = f.class_id
   AND p.term_id  = f.term_id
  WHERE p.term_id = $1
  GROUP BY p.student_id, p.class_id, p.term_id
  HAVING SUM(p.amount_paid) >= MAX(f.amount)
) paid_students`;

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

    const expectedfeeResult = await db.query(
       `
  SELECT COALESCE(SUM(f.amount), 0) AS total_expected_fee
  FROM students s
  JOIN classes c ON s.class_id = c.id
  JOIN school_fees f
    ON f.class_id = c.id
   AND f.term_id = $1
  WHERE s.status = 'Active'
  ` , 
  [activeTerm.id]
    )

    const totalExpectedFee = parseFloat(
      expectedfeeResult.rows[0].total_expected_fee || 0
    ) 
    res.json({
      term_id: activeTerm.id,
      total_students: totalStudents,
      fully_paid: fullyPaidCount,
      owing: owingCount,
      total_amount: totalAmount,
      total_expected_fee : totalExpectedFee
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Section-specific dashboard summary
router.get("/summary/:section", async (req, res) => {
  try {
    const section = req.params.section; // "Primary" or "Secondary"

    // 1️⃣ Get active term
    const termResult = await db.query(
      "SELECT id FROM terms WHERE is_active = true LIMIT 1"
    );
    const activeTerm = termResult.rows[0];
    if (!activeTerm) {
      return res.status(404).json({ error: "No active term found" });
    }

    // 2️⃣ Total students (active only, in this section)
    const studentsResult = await db.query(
      `
      SELECT COUNT(*) AS total_students
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE s.status = 'Active' AND c.section = $1
      `,
      [section]
    );
    const totalStudents = parseInt(studentsResult.rows[0].total_students || 0, 10);

    // 3️⃣ Fully paid students (for their class fee in the active term)
    const fullyPaidSql = `
      SELECT COUNT(*) AS fully_paid
      FROM (
        SELECT p.student_id
        FROM payments p
        JOIN school_fees f
          ON p.class_id = f.class_id
         AND p.term_id = f.term_id
        JOIN students s ON p.student_id = s.id
        JOIN classes c ON s.class_id = c.id
        WHERE p.term_id = $1 AND c.section = $2
        GROUP BY p.student_id, p.class_id, p.term_id
        HAVING SUM(p.amount_paid) >= MAX(f.amount)
      ) paid_students
    `;
    const fullyPaidResult = await db.query(fullyPaidSql, [activeTerm.id, section]);
    const fullyPaidCount = parseInt(fullyPaidResult.rows[0].fully_paid || 0, 10);

    // 4️⃣ Total amount collected (active term only, this section)
    const amountResult = await db.query(
      `
      SELECT COALESCE(SUM(p.amount_paid),0) AS total_amount
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN classes c ON s.class_id = c.id
      WHERE p.term_id = $1 AND c.section = $2
      `,
      [activeTerm.id, section]
    );
    const totalAmount = parseFloat(amountResult.rows[0].total_amount || 0);

    // 5️⃣ Owing students = total - fully paid
    const owingCount = Math.max(0, totalStudents - fullyPaidCount);

    // 6️⃣ Total expected fee for this section
    const expectedFeeResult = await db.query(
      `
      SELECT COALESCE(SUM(f.amount), 0) AS total_expected_fee
      FROM students s
      JOIN classes c ON s.class_id = c.id
      JOIN school_fees f
        ON f.class_id = c.id
       AND f.term_id = $1
      WHERE s.status = 'Active' AND c.section = $2
      `,
      [activeTerm.id, section]
    );
    const totalExpectedFee = parseFloat(expectedFeeResult.rows[0].total_expected_fee || 0);

    // ✅ Send JSON response
    res.json({
      term_id: activeTerm.id,
      section,
      total_students: totalStudents,
      fully_paid: fullyPaidCount,
      owing: owingCount,
      total_amount: totalAmount,
      total_expected_fee: totalExpectedFee
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: err.message });
  }
});



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

    // 2️⃣ Get recent payments (only students who actually paid)
    const query = `
      SELECT 
        p.id AS payment_id,
        s.id AS student_id,
        s.name AS student_name,
        c.name AS class_name,
        p.amount_paid,
        p.payment_mode,
        p.created_at AS payment_date,
        sf.amount AS total_fee,
        (
          sf.amount - COALESCE(
            (SELECT SUM(p2.amount_paid) 
             FROM payments p2 
             WHERE p2.student_id = s.id AND p2.term_id = $1), 
            0
          )
        ) AS balance
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN school_fees sf ON sf.class_id = c.id AND sf.term_id = $1
      WHERE s.status = 'Active' AND p.term_id = $1
      ORDER BY p.created_at DESC
      LIMIT 20;
    `;

    const result = await db.query(query, [activeTerm.id]);

    // 3️⃣ Format for frontend
    const payments = result.rows.map(r => ({
      name: r.student_name,
      class: r.class_name,
      amount: r.amount_paid,
      mode: r.payment_mode || "—",
      date: r.payment_date,
      status: r.balance <= 0 ? "FULL" : "OWING"
    }));

    res.json(payments);
  } catch (err) {
    console.error("Recent payments error:", err);
    res.status(500).json({ error: "Failed to fetch recent payments" });
  }
});



module.exports = router;
