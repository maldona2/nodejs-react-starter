import dotenv from 'dotenv';
import app from './app.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
