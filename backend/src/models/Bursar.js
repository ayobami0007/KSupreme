// const db = require("../config/db");
// const bcrypt = require("bcryptjs"); // optional for hashed passwords

// class Bursar {
//   static async login(username, password) {
//     const [rows] = await db.query(
//       "SELECT * FROM bursars WHERE username=?",
//       [username]
//     );

//     const bursar = rows[0];
//     if (!bursar) return null;

//     // optional password check if hashed
//     // const isValid = await bcrypt.compare(password, bursar.password);
//     // return isValid ? bursar : null;

//     return bursar; // simple for now
//   }

//   static async getAll() {
//     const [rows] = await db.query("SELECT id, username FROM bursars");
//     return rows;
//   }
// }

// module.exports = Bursar;
const db = require("../config/db");
const bcrypt = require("bcryptjs"); // optional for hashed passwords

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
