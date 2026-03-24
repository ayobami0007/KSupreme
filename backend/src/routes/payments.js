
const express = require("express");
const router = express.Router();
const PaymentModel = require("../models/Payment");
const db = require("../config/db"); // use direct db import

function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("required") || msg.includes("must") || msg.includes("positive") || msg.includes("Overpayment")) return 400;
  if (msg.includes("does not exist") || msg.includes("not set")) return 404;
  if (msg.includes("Duplicate") || msg.includes("unique")) return 409;
  if (err && err.code === "22P02") return 400; // invalid_text_representation
  if (err && err.code === "23514") return 400; //  constraint
  return 500;
}

// Create payment
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

    // Basic required fields check
    if (!student_id || !class_id || !term_id || !amount_paid || !payment_mode || !entered_by) {
      return res.status(400).json({ error: "student_id, class_id, term_id, amount_paid, payment_mode and entered_by are required" });
    }

    
    const allowed = ['cash', 'transfer', 'pos'];
    const mode = String(payment_mode).toLowerCase();
    if (!allowed.includes(mode)) {
      return res.status(400).json({ error: `payment_mode must be one of: ${allowed.join(", ")}` });
    }

  
    const payload = { ...req.body, payment_mode: mode };
    const payment = await PaymentModel.create(payload);

    // compute totals to return using direct db import
    const totalPaid = await PaymentModel.getTotalPaid(payment.student_id, payment.class_id, payment.term_id);
    const feeRow = await db.query(
      `SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2`,
      [payment.class_id, payment.term_id]
    );
    const feeAmount = Number(feeRow.rows[0].amount);
    const balance = feeAmount - totalPaid;

    res.status(201).json({
      message: "Payment recorded",
      payment,
      total_paid: totalPaid,
      balance,
      status: balance === 0 ? "FULL" : "PART"
    });
  } catch (err) {
    console.error("Payment error:", err);
    const status = mapErrorToStatus(err);
  
    if (err && err.code === "22P02") {
      return res.status(status).json({ error: "Invalid numeric value in request. Check student_id, class_id, term_id, entered_by, amount_paid." });
    }
    if (err && err.code === "23514") {
      return res.status(status).json({ error: "One or more fields violate database constraints (e.g., invalid payment_mode)." });
    }
    res.status(status).json({ error: err.message });
  }
});





router.get("/students/:id/payment-info", async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    const { class_id, term_id } = req.query; // frontend will pass these
    const info = await PaymentModel.getPaymentInfo(studentId, class_id, term_id);
    res.json(info);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get payments for a student
router.get("/", async (req, res) => {
  try {
    const { student_id, class_id, term_id } = req.query;
    if (!student_id) return res.status(400).json({ error: "student_id is required" });
    const payments = await PaymentModel.getForStudent(student_id, { class_id, term_id });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get payment by id
router.get("/:id", async (req, res) => {
  try {
    const p = await PaymentModel.getById(req.params.id);
    if (!p) return res.status(404).json({ error: "Payment not found" });
    res.json(p);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
