import pool from '../config/db.js';

export const findByEmail = async (email, table) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const findById = async (id, table) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const createUser = async (userData) => {
    const { id, name, email, phone, password_hash, verification_code, verification_code_expires } = userData;
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'INSERT INTO users (id, name, email, phone, password_hash, verification_code, verification_code_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, email, phone, password_hash, verification_code, verification_code_expires]
        );
    } finally {
        connection.release();
    }
};

export const createAgentApplication = async (agentData) => {
    const { id, name, email, phone, agency, experience, cnic, address, password_hash, attachments, verification_code, verification_code_expires } = agentData;
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'INSERT INTO agent_applications (id, name, email, phone, agency, experience, cnic, address, password_hash, attachments, verification_code, verification_code_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, email, phone, agency, experience, cnic, address, password_hash, JSON.stringify(attachments || []), verification_code, verification_code_expires]
        );
    } finally {
        connection.release();
    }
};

export const verifyEmail = async (table, email) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            `UPDATE ${table} SET email_verified = true, verification_code = NULL, verification_code_expires = NULL WHERE email = ?`,
            [email]
        );
    } finally {
        connection.release();
    }
};

export const updateVerificationCode = async (table, email, code, expires) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            `UPDATE ${table} SET verification_code = ?, verification_code_expires = ? WHERE email = ?`,
            [code, expires, email]
        );
    } finally {
        connection.release();
    }
};

export const upsertPasswordReset = async (email, code, expires) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'CREATE TABLE IF NOT EXISTS password_resets (email VARCHAR(255), token VARCHAR(255), expires DATETIME)'
        );
        await connection.query(
            'REPLACE INTO password_resets (email, token, expires) VALUES (?, ?, ?)',
            [email, code, expires]
        );
    } finally {
        connection.release();
    }
};

export const findPasswordReset = async (email, code) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM password_resets WHERE email = ? AND token = ?', [email, code]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const updatePassword = async (table, email, hashedPassword) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`UPDATE ${table} SET password_hash = ? WHERE email = ?`, [hashedPassword, email]);
        await connection.query('DELETE FROM password_resets WHERE email = ?', [email]);
    } finally {
        connection.release();
    }
};
