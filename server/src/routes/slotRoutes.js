import express from 'express';
import {
  getDeliverySlots,
  updateSlotCapacity,
  updateCapacitySchema
} from '../controllers/slotController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getDeliverySlots);
router.patch('/:id/capacity', authenticateToken, requireRole('admin'), validate(updateCapacitySchema), updateSlotCapacity);

export default router;
