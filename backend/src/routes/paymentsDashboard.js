const express = require("express");
const router = express.Router();
const db = require("../config/db");
const PaymentModel = require("../models/Payment");

// GET /api/payments/dashboard/:student_id
router.get("/:student_id", async (req, res) => {
  const { student_id } = req.params;

  try {
    // 1️⃣ Get student info
    const [[student]] = await db.query(
      "SELECT s.id, s.name, s.class_id, c.name AS class_name " +
      "FROM students s JOIN classes c ON s.class_id = c.id WHERE s.id = ?",
      [student_id]
    );

    if (!student) return res.status(404).json({ error: "Student not found" });

    // 2️⃣ Get active term
    const [[activeTerm]] = await db.query(
      "SELECT * FROM terms WHERE is_active=1 LIMIT 1"
    );

    if (!activeTerm) return res.status(404).json({ error: "No active term found" });

    // 3️⃣ Get class fee for this term
    const [[fee]] = await db.query(
      "SELECT amount FROM school_fees WHERE class_id=? AND term_id=?",
      [student.class_id, activeTerm.id]
    );

    const totalFee = fee ? fee.amount : 0;

    // 4️⃣ Get total paid
    const totalPaid = await PaymentModel.getTotalPaid(
      student.id,
      student.class_id,
      activeTerm.id
    );

    const balance = totalFee - totalPaid;

    // 5️⃣ Payment history
    const [payments] = await db.query(
      "SELECT * FROM payments WHERE student_id=? AND class_id=? AND term_id=? ORDER BY created_at DESC",
      [student.id, student.class_id, activeTerm.id]
    );

    res.json({
      student,
      term: activeTerm,
      total_fee: totalFee,
      total_paid: totalPaid,
      balance,
      status: balance === 0 ? "FULL" : "PART",
      payments
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
