import express from 'express';
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  updateOrderStatusSchema
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Admin-only middleware for all admin routes
router.use(authenticateToken, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
