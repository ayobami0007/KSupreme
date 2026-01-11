const db = require("../config/db");
const bcrypt = require("bcryptjs"); // optional for hashed passwords

class Bursar {
  static async login(username, password) {
    const [rows] = await db.query(
      "SELECT * FROM bursars WHERE username=?",
      [username]
    );

    const bursar = rows[0];
    if (!bursar) return null;

    // optional password check if hashed
    // const isValid = await bcrypt.compare(password, bursar.password);
    // return isValid ? bursar : null;

    return bursar; // simple for now
  }

  static async getAll() {
    const [rows] = await db.query("SELECT id, username FROM bursars");
    return rows;
  }
}

module.exports = Bursar;
