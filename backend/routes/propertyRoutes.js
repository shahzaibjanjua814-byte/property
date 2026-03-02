import express from 'express';
import * as PropertyController from '../controllers/propertyController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', PropertyController.getAllProperties);
router.get('/featured/true', PropertyController.getFeaturedProperties);
router.get('/by-society', PropertyController.getPropertiesBySociety);
router.get('/user/:userId', verifyToken, PropertyController.getUserProperties);
router.get('/:id', PropertyController.getPropertyById);
router.get('/:propertyId', PropertyController.getPropertyById); // Alias for compatibility

router.post('/', verifyToken, requireRole('agent', 'admin'), PropertyController.createProperty);
router.put('/:id', verifyToken, requireRole('agent', 'admin'), PropertyController.updateProperty);
router.delete('/:id', verifyToken, requireRole('admin'), PropertyController.deleteProperty);

export default router;
