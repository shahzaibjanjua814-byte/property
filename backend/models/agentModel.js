import pool from '../config/db.js';

export const findAll = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT id, name, email, phone, agency, experience, cnic, address, attachments, created_at FROM agents ORDER BY created_at DESC');
        return rows;
    } finally {
        connection.release();
    }
};

export const findById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM agents WHERE id = ?', [id]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const findByCity = async (city) => {
    const searchTerm = `%${city}%`;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT DISTINCT a.* FROM agents a 
       LEFT JOIN properties p ON a.id = p.agent_id 
       WHERE p.city LIKE ? OR a.address LIKE ? 
       ORDER BY a.created_at DESC`,
            [searchTerm, searchTerm]
        );
        return rows;
    } finally {
        connection.release();
    }
};

export const searchAgents = async (searchTerm) => {
    const connection = await pool.getConnection();
    try {
        const sql = `
      SELECT DISTINCT a.* FROM agents a 
      LEFT JOIN properties p ON a.id = p.agent_id 
      WHERE LOWER(a.address) LIKE ?
         OR LOWER(p.city) LIKE ?
         OR LOWER(p.title) LIKE ?
      ORDER BY 
        CASE 
          WHEN LOWER(a.address) LIKE ? THEN 1
          WHEN LOWER(p.city) LIKE ? THEN 2
          ELSE 3
        END,
        a.created_at DESC
    `;
        const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
        const [rows] = await connection.query(sql, params);
        return rows;
    } finally {
        connection.release();
    }
};

export const findBySociety = async (sql, params) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(sql, params);
        return rows;
    } finally {
        connection.release();
    }
};

// Agent Applications
export const findAllApplications = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM agent_applications ORDER BY created_at DESC');
        return rows;
    } finally {
        connection.release();
    }
};

export const findApplicationById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM agent_applications WHERE id = ?', [id]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const updateApplicationStatus = async (id, status) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'UPDATE agent_applications SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
    } finally {
        connection.release();
    }
};

export const approveAgent = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query('CALL approve_agent(?)', [id]);
    } finally {
        connection.release();
    }
};

export const rejectAgent = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query('CALL reject_agent(?)', [id]);
    } finally {
        connection.release();
    }
};
