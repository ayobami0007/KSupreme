

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// }).promise(); 

// module.exports = pool;
// db.js

require("dotenv").config();
const { Pool } = require('pg'); 


console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


const pool = new Pool({
  host: process.env.DB_HOST,        
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,    
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } 
});

pool.connect().catch(err => console.error("DB connection failed:", err));

module.exports = pool;
