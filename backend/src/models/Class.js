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



// const db = require("../config/db");

// class ClassModel {
//   // static async create(data) {
//   //   const { name, section, level, track } = data;
//   //   try {
//   //     const res = await db.query(
//   //       "INSERT INTO classes (name, section, level, track) VALUES ($1, $2, $3, $4) RETURNING *",
//   //       [name, section, level || null, track || null]
//   //     );
//   //     return res.rows[0];
//   //   } catch (err) {
//   //     console.error("Class create error:", err.message);
//   //     throw err;
//   //   }
//   // }
//   static async create(data) {
//   const { name, section, level, track } = data;

//   // Validate track logic
//   if (
//     section === "Secondary" &&
//     level?.startsWith("SS") &&
//     !track
//   ) {
//     throw new Error("Track is required for Senior Secondary classes.");
//   }

//   if (
//     section === "Secondary" &&
//     level?.startsWith("JSS") &&
//     track
//   ) {
//     throw new Error("Junior Secondary classes should not have a track.");
//   }

//   try {
//     const res = await db.query(
//       "INSERT INTO classes (name, section, level, track) VALUES ($1, $2, $3, $4) RETURNING *",
//       [name, section, level || null, track || null]
//     );
//     return res.rows[0];
//   } catch (err) {
//     console.error("Class create error:", err.message);
//     throw err;
//   }
// }


//   static async getAll(filters = {}) {
//     let sql = "SELECT * FROM classes WHERE 1=1";
//     const params = [];
//     let i = 1;

//     if (filters.section) {
//       sql += ` AND section = $${i++}`;
//       params.push(filters.section);
//     }
//     if (filters.level) {
//       sql += ` AND level = $${i++}`;
//       params.push(filters.level);
//     }
//     if (filters.track) {
//       sql += ` AND track = $${i++}`;
//       params.push(filters.track);
//     }

//     try {
//       const res = await db.query(sql, params);
//       return res.rows;
//     } catch (err) {
//       console.error("Get all classes error:", err.message);
//       throw err;
//     }
//   }

//   static async update(id, data) {
//     const { name, section, level, track } = data;
//     try {
//       await db.query(
//         "UPDATE classes SET name=$1, section=$2, level=$3, track=$4 WHERE id=$5",
//         [name, section, level || null, track || null, id]
//       );
//      if (res.rows.length === 0) { 
//       throw new Error(`No class found with id ${id}`); } 
//       return res.rows[0];
//     } catch (err) {
//       console.error("Class update error:", err.message);
//       throw err;
//     }
//   }
// }

// module.exports = ClassModel;



const db = require("../config/db");

class ClassModel {
  static validateRules({ name, section, level, track }) {
    if (!name || !section || !level) {
      throw new Error("name, section and level are required.");
    }

    if (section === "Secondary" && level.startsWith("SS") && !track) {
      throw new Error("Track is required for Senior Secondary classes.");
    }

    if (section === "Secondary" && level.startsWith("JSS") && track) {
      throw new Error("Junior Secondary classes should not have a track.");
    }

    // Optional: validate allowed track values if provided
    if (track && !["Science", "Arts", "Commercial"].includes(track)) {
      throw new Error("track must be one of: Science, Arts, Commercial.");
    }

    // Optional: validate allowed levels
    if (!["JSS1","JSS2","JSS3","SS1","SS2","SS3"].includes(level)) {
      throw new Error("level must be one of: JSS1,JSS2,JSS3,SS1,SS2,SS3.");
    }
  }

  static mapDbError(err, context = "class") {
    // Unique violation
    if (err && err.code === "23505") {
      // You can inspect err.constraint to be more specific
      return new Error(`A ${context} with the same unique fields already exists.`);
    }
    // Check constraint violation
    if (err && err.code === "23514") {
      return new Error("Invalid class data: one or more fields violate constraints.");
    }
    // Default
    return err;
  }

  static async create(data) {
    const { name, section, level, track } = data;

    // Validate business rules before DB call
    this.validateRules({ name, section, level, track });

    try {
      const res = await db.query(
        `INSERT INTO classes (name, section, level, track)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, section, level || null, track || null]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Class create error:", err.message);
      throw this.mapDbError(err, "class");
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

    // Validate business rules before DB call
    this.validateRules({ name, section, level, track });

    try {
      const res = await db.query(
        `UPDATE classes
         SET name = $1, section = $2, level = $3, track = $4
         WHERE id = $5
         RETURNING *`,
        [name, section, level || null, track || null, id]
      );

      if (!res.rows || res.rows.length === 0) {
        throw new Error(`No class found with id ${id}.`);
      }

      return res.rows[0];
    } catch (err) {
      console.error("Class update error:", err.message);
      throw this.mapDbError(err, "class");
    }
  }
}

module.exports = ClassModel;
