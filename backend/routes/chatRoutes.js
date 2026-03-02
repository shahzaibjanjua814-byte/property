import express from 'express';
import * as ChatController from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', verifyToken, ChatController.getConversations);
router.post('/conversations', verifyToken, ChatController.createConversation);
router.get('/messages/:conversationId', verifyToken, ChatController.getMessages);
router.post('/messages', verifyToken, ChatController.sendMessage);

export default router;
