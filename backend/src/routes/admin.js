import express from 'express';
import { getAdminStats, getAdminSellers } from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, requireRole('admin'), getAdminStats);
router.get('/sellers', protect, requireRole('admin'), getAdminSellers);

export default router;
