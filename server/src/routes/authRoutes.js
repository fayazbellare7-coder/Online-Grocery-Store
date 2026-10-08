import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);
router.put('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

export default router;
