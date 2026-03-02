import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || '216.106.180.123',
    user: process.env.DB_USER || 'webdevco_realuser',
    password: process.env.DB_PASSWORD || 'adeel@490A',
    database: process.env.DB_NAME || 'webdevco_real',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('✓ MySQL database connected successfully (via Config)');
        conn.release();
    })
    .catch(err => {
        console.error('✗ Database connection failed:', err.message);
    });

export default pool;
