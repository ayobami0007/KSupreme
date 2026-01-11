const express = require("express");
const router = express.Router();
const PaymentModel = require("../models/Payment");
const db = require("../config/db");



router.post("/", async (req, res) => {
  try {
    const {
      student_id,
      class_id,
      term_id,
      amount_paid,
      payment_mode,
      entered_by,
      remark
    } = req.body;

    if (!student_id || !class_id || !term_id || !amount_paid || !payment_mode || !entered_by) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Get school fee
    const [[fee]] = await db.query(
      `SELECT amount FROM school_fees WHERE class_id=? AND term_id=?`,
      [class_id, term_id]
    );

    if (!fee) {
      return res.status(404).json({ error: "School fee not set for this class & term" });
    }

    // 2️⃣ Total paid so far
    const totalPaid = await PaymentModel.getTotalPaid(student_id, class_id, term_id);

    // 3️⃣ Normalize numbers
    const feeAmount = Number(fee.amount);
    const paidSoFar = Number(totalPaid) || 0;
    const amountPaid = Number(amount_paid);

    const balance = feeAmount - paidSoFar;

    // 4️⃣ Prevent overpayment
    if (amountPaid > balance) {
      return res.status(400).json({
        error: "Overpayment not allowed",
        balance
      });
    }

    // 5️⃣ Save payment
    await PaymentModel.create(req.body);

    const newTotal = paidSoFar + amountPaid;
    const newBalance = feeAmount - newTotal;

    res.status(201).json({
      message: "Payment recorded",
      total_paid: newTotal,
      balance: newBalance,
      status: newBalance === 0 ? "FULL" : "PART"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


 module.exports = router;