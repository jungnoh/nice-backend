import {NextFunction, Request, Response} from 'express';

interface Err extends Error {
  status: number;
  data?: any;
}

export function handleError(err: Err, _: Request, res: Response, __: NextFunction) {
  const status = err.status ?? 500;
  res.status(status).json({
    success: false
  });
}
