


const db = require("../config/db");

class Term {
  // Create a new term
  // static async create(name, session_id, is_active = false) {
  //   try {
  //     const res = await db.query(
  //       "INSERT INTO terms (name, session_id, is_active) VALUES ($1, $2, $3) RETURNING *",
  //       [name, session_id, Boolean(is_active)]
  //     );
  //     return res.rows[0];
  //   } catch (err) {
  //     if (err.code === "23505") { 
  //       throw new Error(`This session already has a ${name}.`);
  //     }
  //     console.error("Error creating term:", err);
  //      throw new Error(`Failed to create term: ${err.message}`);
  //   }
  // }

  static async create(name, session_id, is_active = false) {
  try {
    // If creating an active term, deactivate all others in the same session first
    if (is_active) {
      await db.query("UPDATE terms SET is_active = false WHERE session_id = $1", [session_id]);
    }

    const res = await db.query(
      "INSERT INTO terms (name, session_id, is_active) VALUES ($1, $2, $3) RETURNING *",
      [name, session_id, Boolean(is_active)]
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



  static async setActive(id) {
  try {
    // Deactivate all terms
    await db.query("UPDATE terms SET is_active = false");

    // Try to activate the chosen term
    const res = await db.query(
      "UPDATE terms SET is_active = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (res.rows.length === 0) {
      throw new Error(`No term found with id ${id}.`);
    }

    return res.rows[0];
  } catch (err) {
    console.error("Failed to set active term:", err);
    throw new Error(err.message);
  }
}


 
  static async getAll() {
  try {
    const res = await db.query(
      `SELECT t.id, t.name, t.is_active, t.session_id, s.name AS session_name
       FROM terms t
       JOIN sessions s ON t.session_id = s.id
       ORDER BY t.id ASC`
    );
    return res.rows;
  } catch (err) {
    console.error("Error fetching all terms:", err);
    throw new Error(`Failed to fetch all terms: ${err.message}`);
  }
}

static async getAllBySession(session_id) {
  try {
    const res = await db.query(
      `SELECT t.id, t.name, t.is_active, t.session_id, s.name AS session_name
       FROM terms t
       JOIN sessions s ON t.session_id = s.id
       WHERE t.session_id = $1
       ORDER BY t.id ASC`,
      [session_id]
    );
    return res.rows;
  } catch (err) {
    console.error("Error fetching terms:", err);
    throw new Error(`Failed to fetch terms: ${err.message}`);
  }
}

 

  static async getActiveBySession(session_id) {
  try {
    const res = await db.query(
      `SELECT t.id, t.name, t.is_active, t.session_id, s.name AS session_name
       FROM terms t
       JOIN sessions s ON t.session_id = s.id
       WHERE t.session_id = $1 AND t.is_active = true
       LIMIT 1`,
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
