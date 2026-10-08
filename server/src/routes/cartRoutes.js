import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
  addToCartSchema,
  updateCartItemSchema,
  mergeCartSchema
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticateToken); // All cart routes require auth

router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);
router.post('/merge', validate(mergeCartSchema), mergeCart);
router.patch('/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
