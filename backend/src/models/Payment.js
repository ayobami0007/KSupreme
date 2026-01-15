// const db = require("../config/db");

// class PaymentModel {
//   static async getTotalPaid(student_id, class_id, term_id) {
//     const [rows] = await db.query(
//       `SELECT COALESCE(SUM(amount_paid), 0) AS total
//        FROM payments
//        WHERE student_id=? AND class_id=? AND term_id=?`,
//       [student_id, class_id, term_id]
//     );
//     return rows[0].total;
//   }

//   static async create(data) {
//     const {
//       student_id,
//       class_id,
//       term_id,
//       fee_type,
//       amount_paid,
//       payment_mode,
//       entered_by,
//       remark
//     } = data;

//     const [result] = await db.query(
//       `INSERT INTO payments
//       (student_id, class_id, term_id, fee_type, amount_paid, payment_mode, entered_by, remark)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         student_id,
//         class_id,
//         term_id,
//         fee_type || "school_fee",
//         amount_paid,
//         payment_mode,
//         entered_by,
//         remark || null
//       ]
//     );

//     return result;
//   }
// }

// module.exports = PaymentModel;
const db = require("../config/db");

class PaymentModel {
  static async studentExists(student_id) {
    const r = await db.query("SELECT 1 FROM students WHERE id = $1", [student_id]);
    return r.rows.length > 0;
  }

  static async classExists(class_id) {
    const r = await db.query("SELECT 1 FROM classes WHERE id = $1", [class_id]);
    return r.rows.length > 0;
  }

  static async termExists(term_id) {
    const r = await db.query("SELECT 1 FROM terms WHERE id = $1", [term_id]);
    return r.rows.length > 0;
  }

  static async getTotalPaid(student_id, class_id, term_id, client = db) {
    const res = await client.query(
      `SELECT COALESCE(SUM(amount_paid), 0) AS total
       FROM payments
       WHERE student_id=$1 AND class_id=$2 AND term_id=$3`,
      [student_id, class_id, term_id]
    );
    return Number(res.rows[0].total);
  }

  static mapDbError(err) {
    if (!err) return err;
    if (err.code === "23503") return new Error("Referenced entity does not exist.");
    if (err.code === "23505") return new Error("Duplicate payment or unique constraint violation.");
    return err;
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

    if (!student_id || !class_id || !term_id || amount_paid === undefined || amount_paid === null || !payment_mode || !entered_by) {
      throw new Error("student_id, class_id, term_id, amount_paid, payment_mode and entered_by are required.");
    }

    const amount = Number(amount_paid);
    if (isNaN(amount) || amount <= 0) throw new Error("amount_paid must be a positive number.");

    const allowedModes = ["CASH", "TRANSFER", "POS", "CHEQUE"];
    if (!allowedModes.includes(String(payment_mode).toUpperCase())) {
      throw new Error(`payment_mode must be one of: ${allowedModes.join(", ")}`);
    }

    // Existence checks
    if (!(await this.studentExists(student_id))) throw new Error(`student_id ${student_id} does not exist.`);
    if (!(await this.classExists(class_id))) throw new Error(`class_id ${class_id} does not exist.`);
    if (!(await this.termExists(term_id))) throw new Error(`term_id ${term_id} does not exist.`);

    // Transactional insert with locking to avoid race conditions
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Lock the school_fees row for this class+term
      const feeRes = await client.query(
        `SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2 FOR UPDATE`,
        [class_id, term_id]
      );
      const feeRow = feeRes.rows[0];
      if (!feeRow) {
        throw new Error("School fee not set for this class & term");
      }
      const feeAmount = Number(feeRow.amount);

      // Compute total paid so far inside the transaction
      const paidSoFar = await this.getTotalPaid(student_id, class_id, term_id, client);

      const balance = feeAmount - paidSoFar;
      if (amount > balance) {
        throw new Error(`Overpayment not allowed. Current balance is ${balance}`);
      }

      // Insert payment
      const insertRes = await client.query(
        `INSERT INTO payments
         (student_id, class_id, term_id, fee_type, amount_paid, payment_mode, entered_by, remark, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
         RETURNING *`,
        [
          student_id,
          class_id,
          term_id,
          fee_type || "school_fee",
          amount,
          payment_mode,
          entered_by,
          remark || null
        ]
      );

      await client.query("COMMIT");

      return insertRes.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw this.mapDbError(err);
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const res = await db.query("SELECT * FROM payments WHERE id = $1", [id]);
    return res.rows[0] || null;
  }

  static async getForStudent(student_id, filters = {}) {
    const params = [student_id];
    let i = 2;
    let sql = `
      SELECT p.*, c.name AS class_name, t.name AS term_name
      FROM payments p
      JOIN classes c ON p.class_id = c.id
      JOIN terms t ON p.term_id = t.id
      WHERE p.student_id = $1
    `;

    if (filters.class_id) {
      sql += ` AND p.class_id = $${i++}`; params.push(filters.class_id);
    }
    if (filters.term_id) {
      sql += ` AND p.term_id = $${i++}`; params.push(filters.term_id);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const res = await db.query(sql, params);
    return res.rows;
  }

  static async getPaymentInfo(student_id, class_id, term_id) {
  // Get student basic info
  const studentRes = await db.query(
    `SELECT s.id, s.name, c.name AS class_name
     FROM students s
     JOIN classes c ON s.class_id = c.id
     WHERE s.id = $1`,
    [student_id]
  );
  const student = studentRes.rows[0];
  if (!student) throw new Error("Student not found");

  // Get fee amount
  const feeRes = await db.query(
    `SELECT amount FROM school_fees WHERE class_id=$1 AND term_id=$2`,
    [class_id, term_id]
  );
  const feeRow = feeRes.rows[0];
  if (!feeRow) throw new Error("School fee not set for this class & term");
  const totalFee = Number(feeRow.amount);

  // Get total paid
  const totalPaid = await this.getTotalPaid(student_id, class_id, term_id);

  // Compute balance & status
  const balance = totalFee - totalPaid;
  let status = "Not Paid";
  if (totalPaid === 0) status = "Not Paid";
  else if (totalPaid < totalFee) status = "Partially Paid";
  else status = "Fully Paid";

  // Get payment history
  const payments = await this.getForStudent(student_id, { class_id, term_id });

  return {
    id: student.id,
    name: student.name,
    class: student.class_name,
    total_fee: totalFee,
    total_paid: totalPaid,
    balance,
    status,
    payments
  };
}



}

module.exports = PaymentModel;

