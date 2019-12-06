import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function rejectValFail(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).json({
      reason: errors.array(),
      success: false
    });
  }
}
