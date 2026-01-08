// ============================================================
// DATABASE CONFIGURATION
// Purpose: MySQL connection pool setup and configuration
// ============================================================

require('dotenv').config();
const mysql = require('mysql2/promise');

// ============================================================
// CONNECTION POOL
// ============================================================
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'racing_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============================================================
// CONNECTION TEST
// ============================================================
pool.getConnection()
    .then(conn => {
        console.log('✔ Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('✗ Database connection failed:', err.message);
    });

module.exports = pool;