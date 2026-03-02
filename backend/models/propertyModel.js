import pool from '../config/db.js';

export const findAll = async (filters) => {
    const { city, type, status, minPrice, maxPrice, society_id, society_phase, society_block } = filters;
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (city) {
        query += ' AND city = ?';
        params.push(city);
    }
    if (type) {
        query += ' AND property_type = ?';
        params.push(type);
    }
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    if (minPrice) {
        query += ' AND price >= ?';
        params.push(minPrice);
    }
    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(maxPrice);
    }
    if (society_id) {
        query += ' AND society_id = ?';
        params.push(society_id);
    }
    if (society_phase) {
        query += ' AND society_phase = ?';
        params.push(society_phase);
    }
    if (society_block) {
        query += ' AND society_block = ?';
        params.push(society_block);
    }

    query += ' ORDER BY created_at DESC';
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(query, params);
        return rows;
    } finally {
        connection.release();
    }
};

export const findById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
        return rows[0];
    } finally {
        connection.release();
    }
};

export const findFeatured = async (limit = 10) => {
    const connection = await pool.getConnection();
    try {
        const [featuredRows] = await connection.query(
            'SELECT * FROM properties WHERE featured = 1 ORDER BY created_at DESC LIMIT ?',
            [limit]
        );

        let allProperties = featuredRows;
        if (allProperties.length < limit) {
            const needed = limit - allProperties.length;
            const [recentRows] = await connection.query(
                'SELECT * FROM properties WHERE featured = 0 ORDER BY created_at DESC LIMIT ?',
                [needed]
            );
            allProperties = allProperties.concat(recentRows);
        }
        return allProperties;
    } finally {
        connection.release();
    }
};

export const create = async (propertyData) => {
    const { id, title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, images, agent_id, status, featured, amenities, society_id, society_phase, society_block } = propertyData;
    const connection = await pool.getConnection();
    try {
        const insertQuery = `
      INSERT INTO properties 
      (id, title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, images, agent_id, status, featured, amenities, society_id, society_phase, society_block) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await connection.query(insertQuery, [
            id, title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, images ? JSON.stringify(images) : null, agent_id, status, featured, amenities ? JSON.stringify(amenities) : null, society_id, society_phase, society_block
        ]);
        return id;
    } finally {
        connection.release();
    }
};

export const update = async (id, propertyData) => {
    const { title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, images, status, featured, amenities, society_id, society_phase, society_block, agent_id } = propertyData;
    const connection = await pool.getConnection();
    try {
        const updateQuery = `
      UPDATE properties 
      SET title = ?, description = ?, price = ?, property_type = ?, bedrooms = ?, bathrooms = ?, area_sqft = ?, address = ?, city = ?, state = ?, zip_code = ?, latitude = ?, longitude = ?, images = ?, amenities = ?, status = ?, featured = ?, society_id = ?, society_phase = ?, society_block = ?, agent_id = ?, updated_at = NOW() 
      WHERE id = ?
    `;
        await connection.query(updateQuery, [
            title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, images ? JSON.stringify(images) : null, amenities ? JSON.stringify(amenities) : null, status, featured, society_id, society_phase, society_block, agent_id, id
        ]);
    } finally {
        connection.release();
    }
};

export const remove = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query('DELETE FROM properties WHERE id = ?', [id]);
    } finally {
        connection.release();
    }
};

export const findByAgent = async (agentId, societyFilters) => {
    const { society_id, society_phase, society_block } = societyFilters;
    let sql = 'SELECT * FROM properties WHERE agent_id = ?';
    let params = [agentId];

    if (society_id) {
        sql += ' AND LOWER(society_id) = LOWER(?)';
        params.push(society_id);
    }
    if (society_phase) {
        sql += ' AND LOWER(society_phase) = LOWER(?)';
        params.push(society_phase);
    }
    if (society_block) {
        sql += ' AND LOWER(society_block) = LOWER(?)';
        params.push(society_block);
    }

    sql += ' ORDER BY created_at DESC';
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(sql, params);
        return rows;
    } finally {
        connection.release();
    }
};

export const findBySociety = async (filters) => {
    const { society_id, society_phase, society_block, type, minPrice, maxPrice } = filters;
    const connection = await pool.getConnection();
    try {
        let sql = 'SELECT * FROM properties WHERE society_id IS NOT NULL';
        let params = [];

        if (society_id) {
            sql += ' AND society_id = ?';
            params.push(society_id);
        }
        if (society_phase) {
            sql += ' AND society_phase = ?';
            params.push(society_phase);
        }
        if (society_block) {
            sql += ' AND society_block = ?';
            params.push(society_block);
        }
        if (type) {
            sql += ' AND property_type = ?';
            params.push(type);
        }
        if (minPrice) {
            sql += ' AND price >= ?';
            params.push(minPrice);
        }
        if (maxPrice) {
            sql += ' AND price <= ?';
            params.push(maxPrice);
        }

        sql += ' ORDER BY created_at DESC';
        const [rows] = await connection.query(sql, params);
        return rows;
    } finally {
        connection.release();
    }
};
