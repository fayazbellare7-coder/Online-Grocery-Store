import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  toggleProductActive,
  deleteProduct,
  createProductSchema,
  updateProductSchema,
  updateStockSchema
} from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticateToken, requireRole('admin'), validate(createProductSchema), createProduct);
router.put('/:id', authenticateToken, requireRole('admin'), validate(updateProductSchema), updateProduct);
router.patch('/:id/stock', authenticateToken, requireRole('admin'), validate(updateStockSchema), updateProductStock);
router.patch('/:id/toggle-active', authenticateToken, requireRole('admin'), toggleProductActive);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteProduct);

export default router;
