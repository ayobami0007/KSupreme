
const db = require("../config/db");

class Session {
  static async create(name) {
    try {
      const res = await db.query(
        "INSERT INTO sessions (name) VALUES ($1) RETURNING *",
        [name]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Error creating session:", err);
      throw new Error(`Failed to create session: ${err.message}`);
    }
  }

  static async getAll() {
    try {
      const res = await db.query("SELECT * FROM sessions ORDER BY id DESC");
      return res.rows;
    } catch (err) {
      console.error("Error fetching sessions:", err);
      throw new Error(`Failed to fetch sessions: ${err.message}`);
    }
  }

  static async setActive(id) {
    try {
      // Reset all sessions to inactive
      await db.query("UPDATE sessions SET is_active = false");
      // Set the selected session as active
      await db.query("UPDATE sessions SET is_active = true WHERE id = $1", [id]);
      // Return the updated session
      const res = await db.query("SELECT * FROM sessions WHERE id = $1", [id]);
      return res.rows[0] || null;
    } catch (err) {
      console.error("Failed to set active session:", err);
      throw new Error(`Failed to set active session: ${err.message}`);
    }
  }

  static async getActive() {
    try {
      const res = await db.query(
        "SELECT * FROM sessions WHERE is_active = true LIMIT 1"
      );
      return res.rows[0] || null;
    } catch (err) {
      console.error("Error fetching active session:", err);
      throw new Error(`Failed to get active session: ${err.message}`);
    }
  }
}

module.exports = Session;
