import app from './app.js';
import { config } from './config/index.js';
import { initDatabase } from './db/index.js';

// Initialize SQLite Schema
initDatabase();

const server = app.listen(config.port, () => {
  console.log(`🛒 FreshCart API Server running on port ${config.port}`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🌱 Mode: ${config.nodeEnv}`);
});

export default server;
