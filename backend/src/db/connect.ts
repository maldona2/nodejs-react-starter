import dotenv from 'dotenv';
import pg from 'pg';
import logger from '../utils/logger.js';

// Load environment variables if not already loaded
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('connect', () => {
  logger.info('Database connected');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Database connection error');
});

export default pool;
