// const db = require("../config/db")

// class SchoolFee {

//     static async create ({ class_id, term_id , amount }){
//         const conn = await db.getConnection();
//         try{
// //   const [result] = await conn.query(
// `INSERT INTO school_fees (class_id, term_id, amount)
// VALUES (?, ?, ?)`,
// [class_id, term_id, amount]
//   );
//   return result
//         } catch (err){
// if (err.code === "ER_DUP_ENTRY"){
//     throw new error("school fee already set for this class and term")
// }
// throw err;
//         } finally{
//             conn.release
//         }
//     }

//    static async getByClassAndTerm(class_id, term_id)  {
//     const conn = await db.getConnection();
// try{
//     const[rows] = await conn.query(

//         `SELECT * FROM school_fees WHERE class_id = ? AND term_id = ? `,
//         [class_id, term_id]
//     );
//     return rows[0]  || null;
// } finally{
//     conn.release();
// }

//    }

//    static async getAll() {
//   const conn = await db.getConnection();
//   try {
//     const [rows] = await conn.query(
//       `SELECT f.id, f.amount, c.name AS class_name, t.name AS term_name
//        FROM school_fees f
//        JOIN classes c ON f.class_id = c.id
//        JOIN terms t ON f.term_id = t.id
//        ORDER BY c.name, t.name`
//     );
//     return rows;
//   } finally {
//     conn.release();
//   }
// }

// }

// module.exports = SchoolFee;

const db = require("../config/db");

class SchoolFee {

  static async create({ class_id, term_id, amount }) {
    try {
      const res = await db.query(
        `INSERT INTO school_fees (class_id, term_id, amount)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [class_id, term_id, amount]
      );
      return res.rows[0];
    } catch (err) {
      if (err.code === "23505") { // Postgres unique violation
        throw new Error("School fee already set for this class and term");
      }
      throw err;
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
        `SELECT f.id, f.amount, c.name AS class_name, t.name AS term_name
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
