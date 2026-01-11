const db = require("../config/db");

class PaymentModel {
  static async getTotalPaid(student_id, class_id, term_id) {
    const [rows] = await db.query(
      `SELECT COALESCE(SUM(amount_paid), 0) AS total
       FROM payments
       WHERE student_id=? AND class_id=? AND term_id=?`,
      [student_id, class_id, term_id]
    );
    return rows[0].total;
  }

  static async create(data) {
    const {
      student_id,
      class_id,
      term_id,
      fee_type,
      amount_paid,
      payment_mode,
      entered_by,
      remark
    } = data;

    const [result] = await db.query(
      `INSERT INTO payments
      (student_id, class_id, term_id, fee_type, amount_paid, payment_mode, entered_by, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        class_id,
        term_id,
        fee_type || "school_fee",
        amount_paid,
        payment_mode,
        entered_by,
        remark || null
      ]
    );

    return result;
  }
}

module.exports = PaymentModel;
