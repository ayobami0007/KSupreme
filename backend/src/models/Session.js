const db = require("../config/db");

class Session {
  static async create(name) {
    try {
      const [result] = await db.query("INSERT INTO sessions (name) VALUES (?)", [name]);
      return result;
    } catch (err) {
      console.error("Error creating session:", err);
      throw new Error(`Failed to create session: ${err.message}`);
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.query("SELECT * FROM sessions ORDER BY id DESC");
      return rows;
    } catch (err) {
      console.error("Error fetching sessions:", err);
      throw new Error(`Failed to fetch sessions: ${err.message}`);
    }
  }

  static async setActive(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("UPDATE sessions SET is_active = 0");
      await conn.query("UPDATE sessions SET is_active = 1 WHERE id = ?", [id]);

      const [rows] = await conn.query("SELECT * FROM sessions WHERE id = ?", [id]);
      await conn.commit();
      return rows[0] || null;
    } catch (err) {
      await conn.rollback();
      console.error("Failed to set active session:", err);
      throw new Error(`Failed to set active session: ${err.message}`);
    } finally {
      conn.release();
    }
  }

  static async getActive() {
    try {
      const [rows] = await db.query("SELECT * FROM sessions WHERE is_active = 1 LIMIT 1");
      return rows[0] || null;
    } catch (err) {
      console.error("Error fetching active session:", err);
      throw new Error(`Failed to get active session: ${err.message}`);
    }
  }
}

module.exports = Session;
