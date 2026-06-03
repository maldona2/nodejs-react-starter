import dotenv from 'dotenv';
import app from './app.js';
import logger from './utils/logger.js';
import pool from './db/connect.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  logger.error({ err }, 'Server failed to start');
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    pool
      .end()
      .then(() => {
        logger.info('Connections closed');
        process.exit(0);
      })
      .catch((err) => {
        logger.error({ err }, 'Error closing database pool');
        process.exit(1);
      });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled promise rejection');
  shutdown('unhandledRejection');
});
