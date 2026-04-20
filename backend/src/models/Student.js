
// const db = require("../config/db");

// class Student {
//   static async classExists(class_id) {
//     if (!class_id) return false;
//     const res = await db.query("SELECT 1 FROM classes WHERE id = $1", [class_id]);
//     return res.rows.length > 0;
//   }

//   static mapDbError(err) {
//     if (!err) return err;
//     if (err.code === "23503") {
//       return new Error("Referenced class does not exist.");
//     }
//     if (err.code === "23505") {
//       return new Error("A student with the same unique field already exists.");
//     }
//     return err;
//   }

//   static async create(data) {
//     const { name, class_id, status } = data;

//     if (!name) throw new Error("name is required.");
//     if (!class_id) throw new Error("class_id is required.");

//     //  verify class exists to give a clearer error before FK fails
//     const exists = await this.classExists(class_id);
//     if (!exists) throw new Error(`class_id ${class_id} does not exist.`);

//     try {
//       const res = await db.query(
//         `INSERT INTO students (name, class_id, status)
//          VALUES ($1, $2, $3)
//          RETURNING *`,
//         [name, class_id, status || "Active"]
//       );
//       return res.rows[0];
//     } catch (err) {
//       console.error("Error creating student:", err);
//       throw this.mapDbError(err);
//     }
//   }

//   // static async getAll(filters = {}, limit=20, offset=0) {
//   //   let sql = `
//   //     SELECT 
//   //       students.*,
//   //       classes.name AS class_name,
//   //       classes.section,
//   //       classes.level,
//   //       classes.track
//   //     FROM students
//   //     JOIN classes ON students.class_id = classes.id
//   //     WHERE 1=1
//   //   `;

//   //   const params = [];
//   //   let i = 1;

//   //   // status filter (default to Active if not provided)
//   //   const status = filters.status || "Active";
//   //   sql += ` AND students.status = $${i++}`;
//   //   params.push(status);

//   //   if (filters.class_id) {
//   //     sql += ` AND students.class_id = $${i++}`;
//   //     params.push(filters.class_id);
//   //   }
//   //   if (filters.section) {
//   //     sql += ` AND classes.section = $${i++}`;
//   //     params.push(filters.section);
//   //   }
//   //   if (filters.level) {
//   //     sql += ` AND classes.level = $${i++}`;
//   //     params.push(filters.level);
//   //   }
//   //   if (filters.track) {
//   //     sql += ` AND classes.track = $${i++}`;
//   //     params.push(filters.track);
//   //   }
//   //   if (filters.search) {
//   //     sql += ` AND students.name ILIKE $${i++}`;
//   //     params.push(`%${filters.search}%`);
//   //   }

//   //   sql += ` ORDER BY students.id DESC LIMIT $${i++} OFFSET $${i++}`;
//   //   params.push(limit);
//   //   params.push(offset)

//   //   try {
//   //     const res = await db.query(sql, params);
//   //     return res.rows;
//   //   } catch (err) {
//   //     console.error("Error fetching students:", err);
//   //     throw new Error(`Failed to fetch students: ${err.message}`);
//   //   }
//   // }

//   static async getAll(filters = {}, limit = 20, offset = 0) {
//     let sql = `
//     SELECT 
//       students.*,
//       classes.name AS class_name,
//       classes.section,
//       classes.level,
//       classes.track
//     FROM students
//     JOIN classes ON students.class_id = classes.id
//     WHERE 1=1
//   `;

//     const params = [];
//     let i = 1;

//     // ✅ Only add status filter if provided
//     if (filters.status) {
//       sql += ` AND students.status = $${i++}`;
//       params.push(filters.status);
//     }

//     if (filters.class_id) {
//       sql += ` AND students.class_id = $${i++}`;
//       params.push(filters.class_id);
//     }
//     if (filters.section) {
//       sql += ` AND classes.section = $${i++}`;
//       params.push(filters.section);
//     }
//     if (filters.level) {
//       sql += ` AND classes.level = $${i++}`;
//       params.push(filters.level);
//     }
//     if (filters.track) {
//       sql += ` AND classes.track = $${i++}`;
//       params.push(filters.track);
//     }
//     if (filters.search) {
//       sql += ` AND students.name ILIKE $${i++}`;
//       params.push(`%${filters.search}%`);
//     }

//     sql += ` ORDER BY students.id DESC LIMIT $${i++} OFFSET $${i++}`;
//     params.push(limit);
//     params.push(offset);

//     try {
//       const res = await db.query(sql, params);

//       // Count query for total rows (without limit/offset)
//       let countSql = `
//       SELECT COUNT(*) AS total
//       FROM students
//       JOIN classes ON students.class_id = classes.id
//       WHERE 1=1
//     `;
//       const countParams = [];
//       let j = 1;

//       // ✅ Only add status filter if provided
//       if (filters.status) {
//         countSql += ` AND students.status = $${j++}`;
//         countParams.push(filters.status);
//       }

//       if (filters.class_id) {
//         countSql += ` AND students.class_id = $${j++}`;
//         countParams.push(filters.class_id);
//       }
//       if (filters.section) {
//         countSql += ` AND classes.section = $${j++}`;
//         countParams.push(filters.section);
//       }
//       if (filters.level) {
//         countSql += ` AND classes.level = $${j++}`;
//         countParams.push(filters.level);
//       }
//       if (filters.track) {
//         countSql += ` AND classes.track = $${j++}`;
//         countParams.push(filters.track);
//       }
//       if (filters.search) {
//         countSql += ` AND students.name ILIKE $${j++}`;
//         countParams.push(`%${filters.search}%`);
//       }

//       const countRes = await db.query(countSql, countParams);
//       const totalCount = parseInt(countRes.rows[0].total, 10);

//       return { rows: res.rows, totalCount };
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       throw new Error(`Failed to fetch students: ${err.message}`);
//     }
//   }




//   static async update(id, data) {
//     const { name, class_id, status } = data;

//     if (!name && !class_id && status === undefined) {
//       throw new Error("At least one of name, class_id or status must be provided.");
//     }

//     if (class_id) {
//       const exists = await this.classExists(class_id);
//       if (!exists) throw new Error(`class_id ${class_id} does not exist.`);
//     }

//     try {
//       const res = await db.query(
//         `UPDATE students
//          SET name = COALESCE($1, name),
//              class_id = COALESCE($2, class_id),
//              status = COALESCE($3, status)
//          WHERE id = $4
//          RETURNING *`,
//         [name, class_id, status, id]
//       );

//       if (!res.rows || res.rows.length === 0) {
//         throw new Error(`No student found with id ${id}.`);
//       }

//       return res.rows[0];
//     } catch (err) {
//       console.error("Error updating student:", err);
//       throw this.mapDbError(err);
//     }
//   }




//   static async getWithStatus({ class_id = null, search = "", status = "", limit = 30, offset = 0 }) {
//     //  Find the active term
//     const termRes = await db.query(
//       "SELECT id FROM terms WHERE is_active = true LIMIT 1"
//     );
//     const activeTerm = termRes.rows[0];
//     if (!activeTerm) {
//       throw new Error("No active term found.");
//     }

//     let sql = `
//     SELECT 
//       s.id,
//       s.name,
//       c.name AS class,
//       COALESCE(SUM(p.amount_paid), 0) AS total_paid,
//       COALESCE(sf.amount, 0) AS total_fee,
//       (COALESCE(sf.amount,0) - COALESCE(SUM(p.amount_paid),0)) AS balance,
//       CASE 
//         WHEN sf.amount IS NULL THEN 'No Fee Set'
//         WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount THEN 'Paid'
//         ELSE 'Owing'
//       END AS status
//     FROM students s
//     JOIN classes c ON s.class_id = c.id
//     LEFT JOIN payments p 
//       ON p.student_id = s.id 
//      AND p.class_id = c.id 
//      AND p.term_id = $1
//     LEFT JOIN school_fees sf 
//       ON sf.class_id = c.id 
//      AND sf.term_id = $1
//     WHERE 1=1
//   `;

//     const params = [activeTerm.id];
//     let i = 2;

//     if (class_id) {
//       sql += ` AND s.class_id = $${i++}`;
//       params.push(parseInt(class_id));
//     }

//     if (search) {
//       sql += ` AND s.name ILIKE $${i++}`;
//       params.push(`%${search}%`);
//     }

//     sql += ` GROUP BY s.id, s.name, c.name, sf.amount `

//     if (status) {
//       sql += ` HAVING
//   CASE
//   WHEN sf.amount IS NULL THEN 'No Fee Set'
//   WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount THEN 'Paid'
//   ELSE 'Owing'
//   END = $${i++}`

//       params.push(status)
//     }

//     sql += `
 
//            ORDER BY s.name ASC 
//            LIMIT $${i} OFFSET $${i + 1}`;
//     params.push(limit);
//     params.push(offset);

//     // Count query for total rows (without limit/offset)
//     let countSql = `
//    SELECT COUNT(*) AS total
//     FROM  ( 
//  SELECT s.id 
//    FROM students s
//     JOIN classes c ON s.class_id = c.id
//      LEFT JOIN payments p 
//      ON p.student_id = s.id 
//      AND p.class_id = c.id 
//      AND p.term_id = $1 
//      LEFT JOIN school_fees sf 
//      ON sf.class_id = c.id 
//      AND sf.term_id = $1 
//      WHERE 1=1 `;

//     const countParams = [activeTerm.id];
//     let j = 2;

//     if (class_id) {
//       countSql += ` AND s.class_id = $${j++}`;
//       countParams.push(parseInt(class_id));
//     }

//     if (search) {
//       countSql += ` AND s.name ILIKE $${j++}`;
//       countParams.push(`%${search}%`);
//     }

//     countSql += ` GROUP BY s.id, c.name, sf.amount`;

//     if (status) {
//       countSql += ` HAVING CASE WHEN sf.amount IS NULL THEN 'No Fee Set'
//      WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount 
//      THEN 'Paid' ELSE 'Owing' END = $${j++}`;
//       countParams.push(status);
//     }
//     countSql += ` ) subquery`;

//     try {
//       const res = await db.query(sql, params);
//       const countRes = await db.query(countSql, countParams);
//       const totalCount = parseInt(countRes.rows[0].total, 10);

//       return { rows: res.rows, totalCount };
//     } catch (err) {
//       console.error("Error fetching students with status:", err);
//       throw new Error(`Failed to fetch students with status: ${err.message}`);
//     }
//   }


// static async getPaymentReport({ class_id, payment_status = "" }) {
  
//   if (!class_id) {
//     throw new Error("class_id is required for payment report");
//   }

//   const termRes = await db.query(
//     "SELECT id FROM terms WHERE is_active = true LIMIT 1"
//   );
//   const activeTerm = termRes.rows[0];
  
//   if (!activeTerm) {
//     throw new Error("No active term found.");
//   }

  
  
//   let sql = `
//     SELECT 
//       s.id,
//       s.name,
//       c.name AS class,
//       COALESCE(SUM(p.amount_paid), 0) AS total_paid,
//       COALESCE(sf.amount, 0) AS total_fee,
//       (COALESCE(sf.amount, 0) - COALESCE(SUM(p.amount_paid), 0)) AS balance,
//       CASE 
//         WHEN sf.amount IS NULL THEN 'No Fee Set'
//         WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount THEN 'Fully Paid'
//          WHEN COALESCE(SUM(p.amount_paid), 0) = 0 THEN 'Not Paid'
//         ELSE 'Partial'
//       END AS payment_status
//     FROM students s
//     JOIN classes c ON s.class_id = c.id
//     LEFT JOIN payments p 
//       ON p.student_id = s.id 
//      AND p.class_id = c.id 
//      AND p.term_id = $1
//     LEFT JOIN school_fees sf 
//       ON sf.class_id = c.id 
//      AND sf.term_id = $1
//     WHERE s.class_id = $2  
//   `;
  

  
//   const params = [activeTerm.id, parseInt(class_id)];

//   sql += ` GROUP BY s.id, s.name, c.name, sf.amount`;


  
//   if (payment_status) {
   
    
//     let statusCondition;
    
//     if (payment_status === "fully_paid") {
//       statusCondition = "COALESCE(SUM(p.amount_paid), 0) >= sf.amount AND sf.amount IS NOT NULL";
//     } else if (payment_status === "partial") {
//       statusCondition = "COALESCE(SUM(p.amount_paid), 0) > 0 AND COALESCE(SUM(p.amount_paid), 0) < sf.amount";
//     } else if (payment_status === "not_paid") {
//       statusCondition = "COALESCE(SUM(p.amount_paid), 0) = 0 AND sf.amount IS NOT NULL";
//     }
    
//     if (statusCondition) {
//       sql += ` HAVING ${statusCondition}`;
//     }
//   }

  
//   sql += ` ORDER BY s.name ASC`;

//   try {
//     const res = await db.query(sql, params);
    
    
//     return res.rows;
    
//   } catch (err) {
//     console.error("Error fetching payment report:", err);
//     throw new Error(`Failed to fetch payment report: ${err.message}`);
//   }
// }


// }

// module.exports = Student;
const db = require("../config/db");

class Student {
  // -------------------------------------------------------------------------
  // Error mapping
  // -------------------------------------------------------------------------
  static mapDbError(err) {
    if (!err) return err;
    if (err.code === "23503") return new Error("Referenced class does not exist.");
    if (err.code === "23505") return new Error("A student with the same unique field already exists.");
    return err;
  }

  // -------------------------------------------------------------------------
  // Helper: build WHERE clause params from filters (shared by data + count queries)
  // Returns { clause: string, params: any[], nextIndex: number }
  // -------------------------------------------------------------------------
  static _buildFilters(filters, startIndex = 1) {
    let clause = "";
    const params = [];
    let i = startIndex;

    if (filters.status) {
      clause += ` AND students.status = $${i++}`;
      params.push(filters.status);
    }
    if (filters.class_id) {
      clause += ` AND students.class_id = $${i++}`;
      params.push(filters.class_id);
    }
    if (filters.section) {
      clause += ` AND classes.section = $${i++}`;
      params.push(filters.section);
    }
    if (filters.level) {
      clause += ` AND classes.level = $${i++}`;
      params.push(filters.level);
    }
    if (filters.track) {
      clause += ` AND classes.track = $${i++}`;
      params.push(filters.track);
    }
    if (filters.search) {
      clause += ` AND students.name ILIKE $${i++}`;
      params.push(`%${filters.search}%`);
    }

    return { clause, params, nextIndex: i };
  }

  // -------------------------------------------------------------------------
  // Create student — let the FK constraint catch a bad class_id (saves 1 round-trip)
  // -------------------------------------------------------------------------
  static async create(data) {
    const { name, class_id, status } = data;

    if (!name)     throw new Error("name is required.");
    if (!class_id) throw new Error("class_id is required.");

    try {
      const res = await db.query(
        `INSERT INTO students (name, class_id, status)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, class_id, status || "Active"]
      );
      return res.rows[0];
    } catch (err) {
      throw this.mapDbError(err);
    }
  }

  // -------------------------------------------------------------------------
  // Update student — let FK handle bad class_id; saves 1 round-trip
  // -------------------------------------------------------------------------
  static async update(id, data) {
    const { name, class_id, status } = data;

    if (!name && !class_id && status === undefined) {
      throw new Error("At least one of name, class_id or status must be provided.");
    }

    try {
      const res = await db.query(
        `UPDATE students
         SET name     = COALESCE($1, name),
             class_id = COALESCE($2, class_id),
             status   = COALESCE($3, status)
         WHERE id = $4
         RETURNING *`,
        [name || null, class_id || null, status ?? null, id]
      );

      if (!res.rows.length) throw new Error(`No student found with id ${id}.`);
      return res.rows[0];
    } catch (err) {
      throw this.mapDbError(err);
    }
  }

  // -------------------------------------------------------------------------
  // getAll — data + count run in parallel; filter logic written once
  // -------------------------------------------------------------------------
  static async getAll(filters = {}, limit = 20, offset = 0) {
    const base = `
      FROM students
      JOIN classes ON students.class_id = classes.id
      WHERE 1=1
    `;

    const { clause, params, nextIndex } = this._buildFilters(filters, 1);

    const dataSql = `
      SELECT students.*, classes.name AS class_name,
             classes.section, classes.level, classes.track
      ${base} ${clause}
      ORDER BY students.id DESC
      LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
    `;
    const dataParams = [...params, limit, offset];

    const countSql  = `SELECT COUNT(*) AS total ${base} ${clause}`;
    const countParams = [...params];

    try {
      const [res, countRes] = await Promise.all([
        db.query(dataSql,  dataParams),
        db.query(countSql, countParams),
      ]);

      return {
        rows:       res.rows,
        totalCount: parseInt(countRes.rows[0].total, 10),
      };
    } catch (err) {
      throw new Error(`Failed to fetch students: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // getWithStatus — active term folded into query; data + count run in parallel
  // -------------------------------------------------------------------------
  static async getWithStatus({ class_id = null, search = "", status = "", limit = 30, offset = 0 }) {

    // Core SELECT / FROM / JOIN — parameterised on term_id ($1)
    const coreFrom = `
      FROM students s
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN payments p
        ON p.student_id = s.id
       AND p.class_id   = c.id
       AND p.term_id    = (SELECT id FROM terms WHERE is_active = true LIMIT 1)
      LEFT JOIN school_fees sf
        ON sf.class_id = c.id
       AND sf.term_id  = (SELECT id FROM terms WHERE is_active = true LIMIT 1)
      WHERE 1=1
    `;

    const params = [];
    let i = 1;
    let extraWhere = "";

    if (class_id) {
      extraWhere += ` AND s.class_id = $${i++}`;
      params.push(parseInt(class_id));
    }
    if (search) {
      extraWhere += ` AND s.name ILIKE $${i++}`;
      params.push(`%${search}%`);
    }

    const statusCase = `
      CASE
        WHEN sf.amount IS NULL                              THEN 'No Fee Set'
        WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount  THEN 'Paid'
        ELSE 'Owing'
      END
    `;

    let havingClause = "";
    if (status) {
      havingClause = ` HAVING ${statusCase} = $${i++}`;
      params.push(status);
    }

    const groupBy = ` GROUP BY s.id, s.name, c.name, sf.amount`;

    // Data query
    const dataSql = `
      SELECT
        s.id,
        s.name,
        c.name                              AS class,
        COALESCE(SUM(p.amount_paid), 0)     AS total_paid,
        COALESCE(sf.amount, 0)              AS total_fee,
        (COALESCE(sf.amount, 0) - COALESCE(SUM(p.amount_paid), 0)) AS balance,
        ${statusCase}                       AS status
      ${coreFrom} ${extraWhere}
      ${groupBy} ${havingClause}
      ORDER BY s.name ASC
      LIMIT $${i} OFFSET $${i + 1}
    `;
    const dataParams = [...params, limit, offset];

    // Count query — wraps the same grouped subquery
    const countSql = `
      SELECT COUNT(*) AS total FROM (
        SELECT s.id
        ${coreFrom} ${extraWhere}
        ${groupBy} ${havingClause}
      ) sub
    `;
    const countParams = [...params];

    try {
      const [res, countRes] = await Promise.all([
        db.query(dataSql,  dataParams),
        db.query(countSql, countParams),
      ]);

      return {
        rows:       res.rows,
        totalCount: parseInt(countRes.rows[0].total, 10),
      };
    } catch (err) {
      throw new Error(`Failed to fetch students with status: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // getPaymentReport — active term folded into query; HAVING uses numeric logic
  // -------------------------------------------------------------------------
  static async getPaymentReport({ class_id, payment_status = "" }) {
    if (!class_id) throw new Error("class_id is required for payment report.");

    const activeTermSubquery = `(SELECT id FROM terms WHERE is_active = true LIMIT 1)`;

    let sql = `
      SELECT
        s.id,
        s.name,
        c.name                                                    AS class,
        COALESCE(SUM(p.amount_paid), 0)                           AS total_paid,
        COALESCE(sf.amount, 0)                                    AS total_fee,
        (COALESCE(sf.amount, 0) - COALESCE(SUM(p.amount_paid), 0)) AS balance,
        CASE
          WHEN sf.amount IS NULL                              THEN 'No Fee Set'
          WHEN COALESCE(SUM(p.amount_paid), 0) >= sf.amount  THEN 'Fully Paid'
          WHEN COALESCE(SUM(p.amount_paid), 0) = 0           THEN 'Not Paid'
          ELSE 'Partial'
        END AS payment_status
      FROM students s
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN payments p
        ON p.student_id = s.id
       AND p.class_id   = c.id
       AND p.term_id    = ${activeTermSubquery}
      LEFT JOIN school_fees sf
        ON sf.class_id = c.id
       AND sf.term_id  = ${activeTermSubquery}
      WHERE s.class_id = $1
      GROUP BY s.id, s.name, c.name, sf.amount
    `;

    const params = [parseInt(class_id)];

    // Use numeric HAVING conditions — avoids repeating the CASE expression
    if (payment_status === "fully_paid") {
      sql += ` HAVING sf.amount IS NOT NULL AND COALESCE(SUM(p.amount_paid), 0) >= sf.amount`;
    } else if (payment_status === "partial") {
      sql += ` HAVING COALESCE(SUM(p.amount_paid), 0) > 0 AND COALESCE(SUM(p.amount_paid), 0) < sf.amount`;
    } else if (payment_status === "not_paid") {
      sql += ` HAVING sf.amount IS NOT NULL AND COALESCE(SUM(p.amount_paid), 0) = 0`;
    }

    sql += ` ORDER BY s.name ASC`;

    try {
      const res = await db.query(sql, params);
      return res.rows;
    } catch (err) {
      throw new Error(`Failed to fetch payment report: ${err.message}`);
    }
  }
}

module.exports = Student;