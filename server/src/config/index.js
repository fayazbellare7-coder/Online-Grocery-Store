import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret_freshcart_jwt_key_2026_dev_env!',
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../db/freshcart.db'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  taxRate: 0.05, // 5% tax
  freeDeliveryThreshold: 35.00, // Free delivery on orders >= $35
  standardDeliveryFee: 4.99,
};
