const db = require("../config/db");

class ClassModel {
  static async create(data) {
    const { name, section, level, track } = data;
    const [result] = await db.query(
      "INSERT INTO classes (name, section, level, track) VALUES (?, ?, ?, ?)",
      [name, section, level || null, track || null]
    );
    return result;
  }

  static async getAll(filters = {}) {
    let sql = "SELECT * FROM classes WHERE 1=1";
    const params = [];

    if (filters.section) {
      sql += " AND section = ?";
      params.push(filters.section);
    }
    if (filters.level) {
      sql += " AND level = ?";
      params.push(filters.level);
    }
    if (filters.track) {
      sql += " AND track = ?";
      params.push(filters.track);
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async update(id, data) {
    const { name, section, level, track } = data;
    await db.query(
      "UPDATE classes SET name=?, section=?, level=?, track=? WHERE id=?",
      [name, section, level || null, track || null, id]
    );
  }
}

module.exports = ClassModel;
