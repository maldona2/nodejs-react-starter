import { Request, Response, NextFunction } from 'express';
import logger from './logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Error');

  // Response already started (e.g. streamed): let Express close the connection.
  if (res.headersSent) {
    return _next(err);
  }

  interface ErrorWithStatusCode extends Error {
    statusCode?: number;
  }

  const statusCode = (err as ErrorWithStatusCode).statusCode || 500;

  // Never leak internal error text on 5xx: the detail is already logged above.
  const message =
    statusCode >= 500
      ? 'Internal Server Error'
      : err.message || 'Request failed';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
