

// const express = require("express");
// const router = express.Router();
// const PaymentModel = require("../models/Payment");
// const db = require("../config/db");

// router.post("/", async (req, res) => {
//   try {
//     const {
//       student_id,
//       class_id,
//       term_id,
//       amount_paid,
//       payment_mode,
//       entered_by,
//       remark
//     } = req.body;

//     if (!student_id || !class_id || !term_id || !amount_paid || !payment_mode || !entered_by) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // 1️⃣ Get school fee
//     const feeResult = await db.query(
//       `SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2`,
//       [class_id, term_id]
//     );
//     const fee = feeResult.rows[0];

//     if (!fee) {
//       return res.status(404).json({ error: "School fee not set for this class & term" });
//     }

//     // 2️⃣ Total paid so far
//     const totalPaid = await PaymentModel.getTotalPaid(student_id, class_id, term_id);

//     // 3️⃣ Normalize numbers
//     const feeAmount = Number(fee.amount);
//     const paidSoFar = Number(totalPaid) || 0;
//     const amountPaid = Number(amount_paid);

//     const balance = feeAmount - paidSoFar;

//     // 4️⃣ Prevent overpayment
//     if (amountPaid > balance) {
//       return res.status(400).json({
//         error: "Overpayment not allowed",
//         balance
//       });
//     }

//     // 5️⃣ Save payment
//     await PaymentModel.create(req.body);

//     const newTotal = paidSoFar + amountPaid;
//     const newBalance = feeAmount - newTotal;

//     res.status(201).json({
//       message: "Payment recorded",
//       total_paid: newTotal,
//       balance: newBalance,
//       status: newBalance === 0 ? "FULL" : "PART"
//     });

//   } catch (err) {
//     console.error("Payment error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const PaymentModel = require("../models/Payment");

function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("required") || msg.includes("must") || msg.includes("positive") || msg.includes("Overpayment")) return 400;
  if (msg.includes("does not exist") || msg.includes("not set")) return 404;
  if (msg.includes("Duplicate") || msg.includes("unique")) return 409;
  return 500;
}

// Create payment
router.post("/", async (req, res) => {
  try {
    const payment = await PaymentModel.create(req.body);
    // compute totals to return
    const totalPaid = await PaymentModel.getTotalPaid(payment.student_id, payment.class_id, payment.term_id);
    const feeRow = await req.app.locals.db.query(
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
    res.status(status).json({ error: err.message });
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
