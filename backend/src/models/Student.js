const db = require("../config/db");

class Student {
  static async create(data) {
    const { name, class_id, status } = data;
    await db.query(
      "INSERT INTO students (name, class_id, status) VALUES (?, ?, ?)",
      [name, class_id, status || "Active"]
    );
  }

  // static async getAll(filters = {}) {
  //   let sql = `
  //     SELECT students.*, classes.name AS class_name, classes.section, classes.level, classes.track
  //     FROM students
  //     JOIN classes ON students.class_id = classes.id
  //     WHERE students.status = 'Active'
  //   `;
  //   const params = [];

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

  if (filters.class_id) {
    sql += " AND students.class_id = ?";
    params.push(filters.class_id);
  }

  if (filters.section) {
    sql += " AND classes.section = ?";
    params.push(filters.section);
  }

  if (filters.level) {
    sql += " AND classes.level = ?";
    params.push(filters.level);
  }

  if (filters.track) {
    sql += " AND classes.track = ?";
    params.push(filters.track);
  }

  const [rows] = await db.query(sql, params);
  return rows;
}

  static async update(id, data) {
    const { name, class_id, status } = data;
    await db.query(
      "UPDATE students SET name=?, class_id=?, status=? WHERE id=?",
      [name, class_id, status, id]
    );
  }
}

module.exports = Student;
