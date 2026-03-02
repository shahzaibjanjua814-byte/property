import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

export const getConversations = async (req, res) => {
    try {
        const { userId, userType } = req.query;
        if (!userId || !userType) return res.status(400).json({ success: false, error: 'userId and userType required' });

        const connection = await pool.getConnection();
        const query = userType === 'user'
            ? `SELECT c.*, (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id AND m.read_status = false AND m.sender_type = 'agent') as unread_count FROM chat_conversations c WHERE c.user_id = ? ORDER BY c.last_message_time DESC`
            : `SELECT c.*, (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id AND m.read_status = false AND m.sender_type = 'user') as unread_count FROM chat_conversations c WHERE c.agent_id = ? ORDER BY c.last_message_time DESC`;

        const [rows] = await connection.query(query, [userId]);
        connection.release();
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { userId, userName, userEmail, agentId, agentName, agentEmail, agentPhone, agentAgency } = req.body;
        const connection = await pool.getConnection();
        const [existing] = await connection.query('SELECT * FROM chat_conversations WHERE user_id = ? AND agent_id = ?', [userId, agentId]);

        if (existing.length > 0) {
            connection.release();
            return res.json({ success: true, data: existing[0], existing: true });
        }

        const id = uuidv4();
        await connection.query('INSERT INTO chat_conversations (id, user_id, user_name, user_email, agent_id, agent_name, agent_email, agent_phone, agent_agency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, userId, userName, userEmail, agentId, agentName, agentEmail, agentPhone, agentAgency]);
        const [newConv] = await connection.query('SELECT * FROM chat_conversations WHERE id = ?', [id]);
        connection.release();
        res.json({ success: true, data: newConv[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC', [req.params.conversationId]);
        connection.release();
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, senderType, senderName, message } = req.body;
        const connection = await pool.getConnection();
        const id = uuidv4();
        await connection.query('INSERT INTO chat_messages (id, conversation_id, sender_id, sender_type, sender_name, message) VALUES (?, ?, ?, ?, ?, ?)', [id, conversationId, senderId, senderType, senderName, message]);
        await connection.query('UPDATE chat_conversations SET last_message = ?, last_message_time = CURRENT_TIMESTAMP WHERE id = ?', [message.substring(0, 100), conversationId]);
        const [newMsg] = await connection.query('SELECT * FROM chat_messages WHERE id = ?', [id]);
        connection.release();
        res.json({ success: true, data: newMsg[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
