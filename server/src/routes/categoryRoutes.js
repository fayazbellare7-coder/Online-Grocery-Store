import express from 'express';
import {
  getAllCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createCategorySchema,
  updateCategorySchema
} from '../controllers/categoryController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:idOrSlug', getCategoryByIdOrSlug);

// Admin-only routes
router.post('/', authenticateToken, requireRole('admin'), validate(createCategorySchema), createCategory);
router.put('/:id', authenticateToken, requireRole('admin'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteCategory);

export default router;
