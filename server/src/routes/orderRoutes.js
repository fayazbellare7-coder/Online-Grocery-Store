import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  rescheduleOrder,
  reorder,
  placeOrderSchema,
  cancelOrderSchema,
  rescheduleOrderSchema
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticateToken); // Orders require user auth

router.post('/', validate(placeOrderSchema), placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', validate(cancelOrderSchema), cancelOrder);
router.patch('/:id/reschedule', validate(rescheduleOrderSchema), rescheduleOrder);
router.post('/:id/reorder', reorder);

export default router;
