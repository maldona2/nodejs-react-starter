import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler.js';

const makeRes = () => {
  const res = {
    headersSent: false,
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { body: { error: { message: string } } };
};

const req = { method: 'GET', url: '/api/thing' } as Request;
const next = jest.fn() as unknown as NextFunction;

describe('errorHandler', () => {
  it('does not leak internal error text to the client on 5xx', () => {
    const res = makeRes();

    errorHandler(
      new Error('connection to 10.0.0.4:5432 refused'),
      req,
      res,
      next
    );

    expect(res.statusCode).toBe(500);
    expect(res.body.error.message).toBe('Internal Server Error');
  });

  it('returns the application message on 4xx', () => {
    const res = makeRes();
    const err = Object.assign(new Error('email is required'), {
      statusCode: 400,
    });

    errorHandler(err, req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toBe('email is required');
  });

  it('delegates to express when the response has already started', () => {
    const res = makeRes();
    res.headersSent = true;

    errorHandler(new Error('too late'), req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(0);
  });
});
