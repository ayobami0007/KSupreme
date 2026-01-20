
const db = require("../config/db");
const bcrypt = require("bcryptjs"); 

class Bursar {
  static async login(username, password) {
    try {
      const res = await db.query(
        "SELECT * FROM bursars WHERE username=$1",
        [username]
      );

      const bursar = res.rows[0];
      if (!bursar) return null;

      // Optional password check if using hashed passwords
      // const isValid = await bcrypt.compare(password, bursar.password);
      // return isValid ? bursar : null;

      return bursar; // simple for now
    } catch (err) {
      console.error("Bursar login error:", err.message);
      throw err;
    }
  }

  static async getAll() {
    try {
      const res = await db.query("SELECT id, username FROM bursars");
      return res.rows;
    } catch (err) {
      console.error("Get all bursars error:", err.message);
      throw err;
    }
  }
}

module.exports = Bursar;
