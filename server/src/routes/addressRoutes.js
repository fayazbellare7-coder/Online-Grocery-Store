import express from 'express';
import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  createAddressSchema,
  updateAddressSchema
} from '../controllers/addressController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticateToken); // All address routes require auth

router.get('/', getAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.put('/:id', validate(updateAddressSchema), updateAddress);
router.patch('/:id/default', setDefaultAddress);
router.delete('/:id', deleteAddress);

export default router;
