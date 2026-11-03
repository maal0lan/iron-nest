import express from 'express';
import {
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerStats,
} from '../controllers/sellerController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', protect, requireRole('seller'), getSellerProducts);
router.get('/orders', protect, requireRole('seller'), getSellerOrders);
router.patch('/orders/:id/status', protect, requireRole('seller'), updateOrderStatus);
router.get('/stats', protect, requireRole('seller'), getSellerStats);

export default router;
