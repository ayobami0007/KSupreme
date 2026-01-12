// const db = require("../config/db");

// class ClassModel {
//   static async create(data) {
//     const { name, section, level, track } = data;
//     const [result] = await db.query(
//       "INSERT INTO classes (name, section, level, track) VALUES (?, ?, ?, ?)",
//       [name, section, level || null, track || null]
//     );
//     return result;
//   }

//   static async getAll(filters = {}) {
//     let sql = "SELECT * FROM classes WHERE 1=1";
//     const params = [];

//     if (filters.section) {
//       sql += " AND section = ?";
//       params.push(filters.section);
//     }
//     if (filters.level) {
//       sql += " AND level = ?";
//       params.push(filters.level);
//     }
//     if (filters.track) {
//       sql += " AND track = ?";
//       params.push(filters.track);
//     }

//     const [rows] = await db.query(sql, params);
//     return rows;
//   }

//   static async update(id, data) {
//     const { name, section, level, track } = data;
//     await db.query(
//       "UPDATE classes SET name=?, section=?, level=?, track=? WHERE id=?",
//       [name, section, level || null, track || null, id]
//     );
//   }
// }

// module.exports = ClassModel;
const db = require("../config/db");

class ClassModel {
  static async create(data) {
    const { name, section, level, track } = data;
    try {
      const res = await db.query(
        "INSERT INTO classes (name, section, level, track) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, section, level || null, track || null]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Class create error:", err.message);
      throw err;
    }
  }

  static async getAll(filters = {}) {
    let sql = "SELECT * FROM classes WHERE 1=1";
    const params = [];
    let i = 1;

    if (filters.section) {
      sql += ` AND section = $${i++}`;
      params.push(filters.section);
    }
    if (filters.level) {
      sql += ` AND level = $${i++}`;
      params.push(filters.level);
    }
    if (filters.track) {
      sql += ` AND track = $${i++}`;
      params.push(filters.track);
    }

    try {
      const res = await db.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error("Get all classes error:", err.message);
      throw err;
    }
  }

  static async update(id, data) {
    const { name, section, level, track } = data;
    try {
      await db.query(
        "UPDATE classes SET name=$1, section=$2, level=$3, track=$4 WHERE id=$5",
        [name, section, level || null, track || null, id]
      );
      return XPathResult.rows[0]
    } catch (err) {
      console.error("Class update error:", err.message);
      throw err;
    }
  }
}

module.exports = ClassModel;
