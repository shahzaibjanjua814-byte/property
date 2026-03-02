import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { searchAmenities } from './controllers/amenityController.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/chat', chatRoutes);
app.get('/api/search/amenities', searchAmenities);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', service: 'real-estate-backend' });
});

// Legacy search endpoint (alias)
app.get('/api/properties/by-society', (req, res) => res.redirect(307, '/api/properties/by-society'));

// Initialization logic
const initChatTables = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        agent_id CHAR(36) NOT NULL,
        agent_name VARCHAR(255) NOT NULL,
        agent_email VARCHAR(255),
        agent_phone VARCHAR(50),
        agent_agency VARCHAR(255),
        last_message TEXT,
        last_message_time TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id CHAR(36) PRIMARY KEY,
        conversation_id CHAR(36) NOT NULL,
        sender_id CHAR(36) NOT NULL,
        sender_type ENUM('user', 'agent') NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read_status BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
      )
    `);
    connection.release();
    console.log('✓ Chat tables initialized successfully');
  } catch (error) {
    console.error('Error initializing chat tables:', error.message);
  }
};

initChatTables();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MVC Server running on http://localhost:${PORT}`);
});
