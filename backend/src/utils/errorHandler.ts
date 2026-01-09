import { Request, Response, NextFunction } from 'express';
import logger from './logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Error');

  interface ErrorWithStatusCode extends Error {
    statusCode?: number;
  }

  const statusCode = (err as ErrorWithStatusCode).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
