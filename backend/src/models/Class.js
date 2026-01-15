
const db = require("../config/db");

class ClassModel {
  
static validateRules({ name, section, level, track }) {
  if (!name || !section) {
    throw new Error("name and section are required.");
  }

  // section must be valid
  if (!["Primary", "Secondary"].includes(section)) {
    throw new Error("section must be 'Primary' or 'Secondary'.");
  }

  // Secondary rules
  if (section === "Secondary") {
    if (!level) throw new Error("level is required for Secondary section.");
    if (!["Junior", "Senior"].includes(level)) {
      throw new Error("For Secondary, level must be 'Junior' or 'Senior'.");
    }

    const allowedNames = ["JSS1","JSS2","JSS3","SS1","SS2","SS3"];
    if (!allowedNames.includes(name)) {
      throw new Error("For Secondary section, name must be one of: JSS1,JSS2,JSS3,SS1,SS2,SS3.");
    }

    if (level === "Senior") {
      if (!track) throw new Error("Track is required for Senior classes.");
      if (!["Science","Arts","Commercial"].includes(track)) {
        throw new Error("track must be one of: Science, Arts, Commercial.");
      }
      if (!name.startsWith("SS")) {
        throw new Error("Senior class name must start with 'SS' (e.g., SS1).");
      }
    }

    if (level === "Junior") {
      if (track) throw new Error("Junior classes should not have a track.");
      if (!name.startsWith("JSS")) {
        throw new Error("Junior class name must start with 'JSS' (e.g., JSS1).");
      }
    }
  }

  // Primary rules
  if (section === "Primary") {
    // Primary must not use Junior/Senior level
    if (level !== undefined && level !== null) {
      throw new Error("Primary classes must not have a level; set level to null or omit it.");
    }
    if (track) {
      throw new Error("Primary classes should not have a track.");
    }
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
