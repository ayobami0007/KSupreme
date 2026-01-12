// const db = require("../config/db");

// class Student {
//   static async create(data) {
//     const { name, class_id, status } = data;
//     await db.query(
//       "INSERT INTO students (name, class_id, status) VALUES (?, ?, ?)",
//       [name, class_id, status || "Active"]
//     );
//   }


//   static async getAll(filters = {}) {
//   let sql = `
//     SELECT 
//       students.*,
//       classes.name AS class_name,
//       classes.section,
//       classes.level,
//       classes.track
//     FROM students
//     JOIN classes ON students.class_id = classes.id
//     WHERE students.status = 'Active'
//   `;

//   const params = [];

//   if (filters.class_id) {
//     sql += " AND students.class_id = ?";
//     params.push(filters.class_id);
//   }

//   if (filters.section) {
//     sql += " AND classes.section = ?";
//     params.push(filters.section);
//   }

//   if (filters.level) {
//     sql += " AND classes.level = ?";
//     params.push(filters.level);
//   }

//   if (filters.track) {
//     sql += " AND classes.track = ?";
//     params.push(filters.track);
//   }

//   const [rows] = await db.query(sql, params);
//   return rows;
// }

//   static async update(id, data) {
//     const { name, class_id, status } = data;
//     await db.query(
//       "UPDATE students SET name=?, class_id=?, status=? WHERE id=?",
//       [name, class_id, status, id]
//     );
//   }
// }

// module.exports = Student;
const db = require("../config/db");

class Student {
  static async create(data) {
    const { name, class_id, status } = data;
    try {
      const res = await db.query(
        "INSERT INTO students (name, class_id, status) VALUES ($1, $2, $3) RETURNING *",
        [name, class_id, status || "Active"]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Error creating student:", err);
      throw new Error(`Failed to create student: ${err.message}`);
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
      WHERE students.status = 'Active'
    `;

    const params = [];
    let counter = 1; // for $1, $2, $3 placeholders

    if (filters.class_id) {
      sql += ` AND students.class_id = $${counter++}`;
      params.push(filters.class_id);
    }
    if (filters.section) {
      sql += ` AND classes.section = $${counter++}`;
      params.push(filters.section);
    }
    if (filters.level) {
      sql += ` AND classes.level = $${counter++}`;
      params.push(filters.level);
    }
    if (filters.track) {
      sql += ` AND classes.track = $${counter++}`;
      params.push(filters.track);
    }

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
    try {
      const res = await db.query(
        "UPDATE students SET name=$1, class_id=$2, status=$3 WHERE id=$4 RETURNING *",
        [name, class_id, status, id]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Error updating student:", err);
      throw new Error(`Failed to update student: ${err.message}`);
    }
  }
}

module.exports = Student;
