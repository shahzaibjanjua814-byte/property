import * as AgentModel from '../models/agentModel.js';
import * as PropertyModel from '../models/propertyModel.js';

export const getAllAgents = async (req, res) => {
    try {
        const rows = await AgentModel.findAll();
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAgentById = async (req, res) => {
    try {
        const agent = await AgentModel.findById(req.params.id || req.params.agentId);
        if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
        res.json({ success: true, data: agent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAgentsByCity = async (req, res) => {
    try {
        const rows = await AgentModel.findByCity(req.params.city);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const searchAgents = async (req, res) => {
    try {
        const query = req.params.query.toLowerCase().trim();
        const rows = await AgentModel.searchAgents(`%${query}%`);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAgentsBySociety = async (req, res) => {
    try {
        const { society_id, society_phase, society_block } = req.query;

        // Society keywords mapping (from server.js)
        const societyKeywords = {
            '1': ['DHA', 'Defence', 'Defense', 'DHA Lahore'],
            'dha-karachi': ['DHA', 'Defence', 'Defense', 'DHA Karachi'],
            // ... (as in original)
        };

        let sql;
        let params = [];

        if (society_phase || society_block) {
            let whereConditions = [];
            if (society_id) { whereConditions.push(`LOWER(p.society_id) = LOWER(?)`); params.push(society_id); }
            if (society_phase) { whereConditions.push(`LOWER(p.society_phase) = LOWER(?)`); params.push(society_phase); }
            if (society_block) { whereConditions.push(`LOWER(p.society_block) = LOWER(?)`); params.push(society_block); }

            sql = `SELECT DISTINCT a.*, COUNT(DISTINCT p.id) as property_count FROM agents a INNER JOIN properties p ON a.id = p.agent_id WHERE ${whereConditions.join(' AND ')} GROUP BY a.id ORDER BY property_count DESC, a.created_at DESC LIMIT 50`;
        } else if (society_id) {
            const keywords = societyKeywords[society_id] || [society_id.replace(/-/g, ' ')];
            let searchConditions = [`LOWER(p.society_id) = LOWER(?)`];
            params.push(society_id);
            keywords.forEach(kw => {
                searchConditions.push(`LOWER(p.title) LIKE LOWER(?)`, `LOWER(p.address) LIKE LOWER(?)`);
                params.push(`%${kw}%`, `%${kw}%`);
            });
            sql = `SELECT DISTINCT a.*, COUNT(DISTINCT p.id) as property_count FROM agents a INNER JOIN properties p ON a.id = p.agent_id WHERE (${searchConditions.join(' OR ')}) GROUP BY a.id ORDER BY property_count DESC, a.created_at DESC LIMIT 50`;
        } else {
            sql = `SELECT DISTINCT a.*, COUNT(DISTINCT p.id) as property_count FROM agents a INNER JOIN properties p ON a.id = p.agent_id GROUP BY a.id ORDER BY property_count DESC, a.created_at DESC LIMIT 20`;
        }

        const rows = await AgentModel.findBySociety(sql, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAgentProperties = async (req, res) => {
    try {
        const rows = await PropertyModel.findByAgent(req.params.agentId, req.query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Applications
export const getAllApplications = async (req, res) => {
    try {
        const rows = await AgentModel.findAllApplications();
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const approveApplication = async (req, res) => {
    try {
        await AgentModel.approveAgent(req.params.id);
        res.json({ success: true, message: 'Agent approved' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rejectApplication = async (req, res) => {
    try {
        await AgentModel.rejectAgent(req.params.id);
        res.json({ success: true, message: 'Agent application rejected' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
