import express from 'express';
import {
  getProducts,
  getCategories,
  getProductById,
  getRelated,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getSeller,
  getSellerProducts,
} from '../controllers/productController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelated);

// Seller / protected
router.post('/', protect, requireRole('seller'), createProduct);
router.put('/:id', protect, requireRole('seller'), updateProduct);
router.delete('/:id', protect, requireRole('seller'), deleteProduct);
router.patch('/:id/stock', protect, requireRole('seller'), updateStock);

// Seller shop pages (public)
router.get('/sellers/:id', getSeller);
router.get('/sellers/:id/products', getSellerProducts);

export default router;
