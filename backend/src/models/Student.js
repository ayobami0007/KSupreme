
// const db = require("../config/db");

// class Student {
//   static async create(data) {
//     const { name, class_id, status } = data;
//     try {
//       const res = await db.query(
//         "INSERT INTO students (name, class_id, status) VALUES ($1, $2, $3) RETURNING *",
//         [name, class_id, status || "Active"]
//       );
//       return res.rows[0];
//     } catch (err) {
//       console.error("Error creating student:", err);
//       throw new Error(`Failed to create student: ${err.message}`);
//     }
//   }

//   static async getAll(filters = {}) {
//     let sql = `
//       SELECT 
//         students.*,
//         classes.name AS class_name,
//         classes.section,
//         classes.level,
//         classes.track
//       FROM students
//       JOIN classes ON students.class_id = classes.id
//       WHERE students.status = 'Active'
//     `;

//     const params = [];
//     let counter = 1; // for $1, $2, $3 placeholders

//     if (filters.class_id) {
//       sql += ` AND students.class_id = $${counter++}`;
//       params.push(filters.class_id);
//     }
//     if (filters.section) {
//       sql += ` AND classes.section = $${counter++}`;
//       params.push(filters.section);
//     }
//     if (filters.level) {
//       sql += ` AND classes.level = $${counter++}`;
//       params.push(filters.level);
//     }
//     if (filters.track) {
//       sql += ` AND classes.track = $${counter++}`;
//       params.push(filters.track);
//     }

//     try {
//       const res = await db.query(sql, params);
//       return res.rows;
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       throw new Error(`Failed to fetch students: ${err.message}`);
//     }
//   }

//   static async update(id, data) {
//     const { name, class_id, status } = data;
//     try {
//       const res = await db.query(
//         "UPDATE students SET name=$1, class_id=$2, status=$3 WHERE id=$4 RETURNING *",
//         [name, class_id, status, id]
//       );
//       return res.rows[0];
//     } catch (err) {
//       console.error("Error updating student:", err);
//       throw new Error(`Failed to update student: ${err.message}`);
//     }
//   }
// }

// module.exports = Student;
const db = require("../config/db");

class Student {
  static async classExists(class_id) {
    if (!class_id) return false;
    const res = await db.query("SELECT 1 FROM classes WHERE id = $1", [class_id]);
    return res.rows.length > 0;
  }

  static mapDbError(err) {
    if (!err) return err;
    if (err.code === "23503") {
      return new Error("Referenced class does not exist.");
    }
    if (err.code === "23505") {
      return new Error("A student with the same unique field already exists.");
    }
    return err;
  }

  static async create(data) {
    const { name, class_id, status } = data;

    if (!name) throw new Error("name is required.");
    if (!class_id) throw new Error("class_id is required.");

    // Optional: verify class exists to give a clearer error before FK fails
    const exists = await this.classExists(class_id);
    if (!exists) throw new Error(`class_id ${class_id} does not exist.`);

    try {
      const res = await db.query(
        `INSERT INTO students (name, class_id, status)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, class_id, status || "Active"]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Error creating student:", err);
      throw this.mapDbError(err);
    }
  }

  static async getAll(filters = {}) {
    let sql = `
      SELECT 
        students.*,
        classes.name AS class_name,
        classes.section,
        classes.level,
        classes.track
      FROM students
      JOIN classes ON students.class_id = classes.id
      WHERE 1=1
    `;

    const params = [];
    let i = 1;

    // status filter (default to Active if not provided)
    const status = filters.status || "Active";
    sql += ` AND students.status = $${i++}`;
    params.push(status);

    if (filters.class_id) {
      sql += ` AND students.class_id = $${i++}`;
      params.push(filters.class_id);
    }
    if (filters.section) {
      sql += ` AND classes.section = $${i++}`;
      params.push(filters.section);
    }
    if (filters.level) {
      sql += ` AND classes.level = $${i++}`;
      params.push(filters.level);
    }
    if (filters.track) {
      sql += ` AND classes.track = $${i++}`;
      params.push(filters.track);
    }
    if (filters.search) {
      sql += ` AND students.name ILIKE $${i++}`;
      params.push(`%${filters.search}%`);
    }

    sql += ` ORDER BY students.id DESC`;

    try {
      const res = await db.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error("Error fetching students:", err);
      throw new Error(`Failed to fetch students: ${err.message}`);
    }
  }

  static async update(id, data) {
    const { name, class_id, status } = data;

    if (!name && !class_id && status === undefined) {
      throw new Error("At least one of name, class_id or status must be provided.");
    }

    if (class_id) {
      const exists = await this.classExists(class_id);
      if (!exists) throw new Error(`class_id ${class_id} does not exist.`);
    }

    try {
      const res = await db.query(
        `UPDATE students
         SET name = COALESCE($1, name),
             class_id = COALESCE($2, class_id),
             status = COALESCE($3, status)
         WHERE id = $4
         RETURNING *`,
        [name, class_id, status, id]
      );

      if (!res.rows || res.rows.length === 0) {
        throw new Error(`No student found with id ${id}.`);
      }

      return res.rows[0];
    } catch (err) {
      console.error("Error updating student:", err);
      throw this.mapDbError(err);
    }
  }

static async getWithStatus({ class_id, termName, sessionName, search, offset = 0 }) {
  let sql = `
    SELECT 
      s.id,
      s.name,
      c.name AS class,
      COALESCE(SUM(p.amount_paid), 0) AS total_paid,
      COALESCE(sf.amount, 0) AS total_fee,
      CASE 
        WHEN sf.amount IS NULL THEN 'No Fee Set'
        WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount THEN 'Paid'
        ELSE 'Owing'
      END AS status
    FROM students s
    JOIN classes c ON s.class_id = c.id
    LEFT JOIN payments p ON p.student_id = s.id
    LEFT JOIN school_fees sf 
      ON sf.class_id = c.id 
     AND sf.term_id = (
        SELECT t.id
        FROM terms t
        JOIN sessions ss ON t.session_id = ss.id
        WHERE t.name = $1 AND ss.name = $2
      )
    WHERE 1=1
  `;

  const params = [termName, sessionName];
  let i = 3;

  if (class_id) {
    sql += ` AND s.class_id = $${i++}`;
    params.push(class_id);
  }

  if (search) {
    sql += ` AND s.name ILIKE $${i}`;
    params.push(`%${search}%`);
    i++;
  }

  sql += ` GROUP BY s.id, s.name, c.name, sf.amount 
           ORDER BY s.name ASC 
           LIMIT $${i} OFFSET $${i+1}`;
  params.push(40); // limit
  params.push(offset || 0);

  try {
    const res = await db.query(sql, params);
    return res.rows;
  } catch (err) {
    console.error("Error fetching students with status:", err);
    throw new Error(`Failed to fetch students with status: ${err.message}`);
  }
}


}

module.exports = Student;
