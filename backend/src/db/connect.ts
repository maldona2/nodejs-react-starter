import dotenv from 'dotenv';
import pg from 'pg';
import logger from '../utils/logger.js';

// Load environment variables if not already loaded
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const isProduction = process.env.NODE_ENV === 'production';
const sslNoVerify = process.env.DB_SSL_NO_VERIFY === 'true';

if (isProduction && sslNoVerify) {
  logger.warn(
    'DB_SSL_NO_VERIFY=true: TLS certificate verification is DISABLED in production'
  );
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: !sslNoVerify } : false,
});

pool.on('connect', () => {
  logger.info('Database connected');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Database connection error');
});

export default pool;
