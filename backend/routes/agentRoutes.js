import express from 'express';
import * as AgentController from '../controllers/agentController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', AgentController.getAllAgents);
router.get('/by-society', AgentController.getAgentsBySociety);
router.get('/city/:city', AgentController.getAgentsByCity);
router.get('/search/:query', AgentController.searchAgents);
router.get('/:id', AgentController.getAgentById);
router.get('/:agentId/properties', AgentController.getAgentProperties);

// Applications (Admin only)
router.get('/applications', verifyToken, requireRole('admin'), AgentController.getAllApplications);
router.post('/applications/:id/approve', verifyToken, requireRole('admin'), AgentController.approveApplication);
router.post('/applications/:id/reject', verifyToken, requireRole('admin'), AgentController.rejectApplication);

export default router;
