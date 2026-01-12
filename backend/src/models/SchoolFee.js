



// const db = require("../config/db");

// class SchoolFee {
//   static async classExists(class_id) {
//     const res = await db.query("SELECT 1 FROM classes WHERE id = $1", [class_id]);
//     return res.rows.length > 0;
//   }

//   static async termExists(term_id) {
//     const res = await db.query("SELECT 1 FROM terms WHERE id = $1", [term_id]);
//     return res.rows.length > 0;
//   }

//   static mapDbError(err) {
//     if (!err) return err;
//     if (err.code === "23505") return new Error("School fee already set for this class and term.");
//     if (err.code === "23503") return new Error("Referenced class or term does not exist.");
//     return err;
//   }

//   static async create({ class_id, term_id, amount }) {
//     if (!class_id || !term_id || amount === undefined || amount === null) {
//       throw new Error("class_id, term_id and amount are required.");
//     }
//     if (isNaN(amount) || Number(amount) <= 0) {
//       throw new Error("amount must be a positive number.");
//     }

//     const classOk = await this.classExists(class_id);
//     if (!classOk) throw new Error(`class_id ${class_id} does not exist.`);

//     const termOk = await this.termExists(term_id);
//     if (!termOk) throw new Error(`term_id ${term_id} does not exist.`);

//     try {
//       const res = await db.query(
//         `INSERT INTO school_fees (class_id, term_id, amount)
//          VALUES ($1, $2, $3)
//          RETURNING *`,
//         [class_id, term_id, amount]
//       );
//       return res.rows[0];
//     } catch (err) {
//       throw this.mapDbError(err);
//     }
//   }

//   static async getByClassAndTerm(class_id, term_id) {
//     try {
//       const res = await db.query(
//         `SELECT * FROM school_fees WHERE class_id = $1 AND term_id = $2`,
//         [class_id, term_id]
//       );
//       return res.rows[0] || null;
//     } catch (err) {
//       console.error("getByClassAndTerm error:", err.message);
//       throw err;
//     }
//   }

//   static async getAll() {
//     try {
//       const res = await db.query(
//         `SELECT f.id, f.amount, c.id AS class_id, c.name AS class_name, t.id AS term_id, t.name AS term_name
//          FROM school_fees f
//          JOIN classes c ON f.class_id = c.id
//          JOIN terms t ON f.term_id = t.id
//          ORDER BY c.name, t.name`
//       );
//       return res.rows;
//     } catch (err) {
//       console.error("getAll school fees error:", err.message);
//       throw err;
//     }
//   }
// }

// module.exports = SchoolFee;

const db = require("../config/db");

class SchoolFee {
  static async classExists(class_id) {
    const res = await db.query("SELECT 1 FROM classes WHERE id = $1", [class_id]);
    return res.rows.length > 0;
  }

  static async termExists(term_id) {
    const res = await db.query("SELECT 1 FROM terms WHERE id = $1", [term_id]);
    return res.rows.length > 0;
  }

  static mapDbError(err) {
    if (!err) return err;
    if (err.code === "23505") return new Error("School fee already set for this class and term.");
    if (err.code === "23503") return new Error("Referenced class or term does not exist.");
    return err;
  }

  static async create({ class_id, term_id, amount }) {
    if (!class_id || !term_id || amount === undefined || amount === null) {
      throw new Error("class_id, term_id and amount are required.");
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      throw new Error("amount must be a positive number.");
    }

    const classOk = await this.classExists(class_id);
    if (!classOk) throw new Error(`class_id ${class_id} does not exist.`);

    const termOk = await this.termExists(term_id);
    if (!termOk) throw new Error(`term_id ${term_id} does not exist.`);

    try {
      const res = await db.query(
        `INSERT INTO school_fees (class_id, term_id, amount)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [class_id, term_id, amount]
      );
      return res.rows[0];
    } catch (err) {
      throw this.mapDbError(err);
    }
  }

  static async getByClassAndTerm(class_id, term_id) {
    try {
      const res = await db.query(
        `SELECT * FROM school_fees WHERE class_id = $1 AND term_id = $2`,
        [class_id, term_id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.error("getByClassAndTerm error:", err.message);
      throw err;
    }
  }

  static async getAll() {
    try {
      const res = await db.query(
        `SELECT f.id, f.amount, c.id AS class_id, c.name AS class_name, t.id AS term_id, t.name AS term_name
         FROM school_fees f
         JOIN classes c ON f.class_id = c.id
         JOIN terms t ON f.term_id = t.id
         ORDER BY c.name, t.name`
      );
      return res.rows;
    } catch (err) {
      console.error("getAll school fees error:", err.message);
      throw err;
    }
  }
}

module.exports = SchoolFee;
