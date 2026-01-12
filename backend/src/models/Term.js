// const db = require("../config/db");

// class Term {
//   // Create a new term
//   static async create(name, session_id, is_active=0)  {
//     try {
//       const [result] = await db.query(
//         "INSERT INTO terms (name, session_id, is_active) VALUES (?, ?, ?)",
//         [name, session_id, is_active]
//       );
//       return result;
//     } catch (err) {
//       console.error("Error creating term:", err);
//       throw new Error(`Failed to create term: ${err.message}`);
//     }
//   }

//   // Get all terms for a session
//   static async getAllBySession(session_id) {
//     try {
//       const [rows] = await db.query(
//         "SELECT * FROM terms WHERE session_id = ? ORDER BY id ASC",
//         [session_id]
//       );
//       return rows;
//     } catch (err) {
//       console.error("Error fetching terms:", err);
//       throw new Error(`Failed to fetch terms: ${err.message}`);
//     }
//   }

//   // Set one term as active for a session
//   // static async setActive(id, session_id) {
//   //   const conn = await db.getConnection();
//   //   try {
//   //     await conn.beginTransaction();

//   //     // Deactivate all terms in this session
//   //     await conn.query("UPDATE terms SET is_active = 0 WHERE session_id = ?", [session_id]);

//   //     // Activate the chosen term
//   //     await conn.query("UPDATE terms SET is_active = 1 WHERE id = ?", [id]);

//   //     // Fetch and return the activated term
//   //     const [rows] = await conn.query(
//   //       "SELECT * FROM terms WHERE id = ?",
//   //       [id]
//   //     );

//   //     await conn.commit();
//   //     return rows[0] || null;
//   //   } catch (err) {
//   //     await conn.rollback();
//   //     console.error("Failed to set active term:", err);
//   //     throw new Error(`Failed to set active term: ${err.message}`);
//   //   } finally {
//   //     conn.release();
//   //   }
//   // }

//   // Set one term as active globally
// static async setActive(id) {
//   const conn = await db.getConnection();
//   try {
//     await conn.beginTransaction();

//     // Deactivate all terms in the database
//     await conn.query("UPDATE terms SET is_active = 0");

//     // Activate the chosen term
//     await conn.query("UPDATE terms SET is_active = 1 WHERE id = ?", [id]);

//     // Fetch and return the activated term
//     const [rows] = await conn.query("SELECT * FROM terms WHERE id = ?", [id]);

//     await conn.commit();
//     return rows[0] || null;
//   } catch (err) {
//     await conn.rollback();
//     console.error("Failed to set active term:", err);
//     throw new Error(`Failed to set active term: ${err.message}`);
//   } finally {
//     conn.release();
//   }
// }


//   // Get all terms (across all sessions)
// static async getAll() {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM terms ORDER BY id ASC"
//     );
//     return rows;
//   } catch (err) {
//     console.error("Error fetching all terms:", err);
//     throw new Error(`Failed to fetch all terms: ${err.message}`);
//   }
// }


//   // Get active term for a session
//   static async getActiveBySession(session_id) {
//     try {
//       const [rows] = await db.query(
//         "SELECT * FROM terms WHERE session_id = ? AND is_active = 1 LIMIT 1",
//         [session_id]
//       );
//       return rows[0] || null;
//     } catch (err) {
//       console.error("Error fetching active term:", err);
//       throw new Error(`Failed to get active term: ${err.message}`);
//     }
//   }
// }

// module.exports = Term;
const db = require("../config/db");

class Term {
  // Create a new term
  static async create(name, session_id, is_active = false) {
    try {
      const res = await db.query(
        "INSERT INTO terms (name, session_id, is_active) VALUES ($1, $2, $3) RETURNING *",
        [name, session_id, is_active]
      );
      return res.rows[0];
    } catch (err) {
      if (err.code === "23505") { 
        throw new Error(`This session already has a ${name}.`);
      }
      console.error("Error creating term:", err);
       throw new Error(`Failed to create term: ${err.message}`);
    }
  }

  // Get all terms for a session
  static async getAllBySession(session_id) {
    try {
      const res = await db.query(
        "SELECT * FROM terms WHERE session_id = $1 ORDER BY id ASC",
        [session_id]
      );
      return res.rows;
    } catch (err) {
      console.error("Error fetching terms:", err);
      throw new Error(`Failed to fetch terms: ${err.message}`);
    }
  }

  // Set one term as active globally
  static async setActive(id) {
    try {
      // Deactivate all terms
      await db.query("UPDATE terms SET is_active = false");

      // Activate the chosen term
      const res = await db.query(
        "UPDATE terms SET is_active = true WHERE id = $1 RETURNING *",
        [id]
      );

      return res.rows[0] || null;
    } catch (err) {
      console.error("Failed to set active term:", err);
      throw new Error(`Failed to set active term: ${err.message}`);
    }
  }

  // Get all terms (across all sessions)
  static async getAll() {
    try {
      const res = await db.query(
        "SELECT * FROM terms ORDER BY id ASC"
      );
      return res.rows;
    } catch (err) {
      console.error("Error fetching all terms:", err);
      throw new Error(`Failed to fetch all terms: ${err.message}`);
    }
  }

  // Get active term for a session
  static async getActiveBySession(session_id) {
    try {
      const res = await db.query(
        "SELECT * FROM terms WHERE session_id = $1 AND is_active = true LIMIT 1",
        [session_id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.error("Error fetching active term:", err);
      throw new Error(`Failed to get active term: ${err.message}`);
    }
  }
}

module.exports = Term;
