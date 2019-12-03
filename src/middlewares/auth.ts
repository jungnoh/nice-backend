import {NextFunction, Request, Response} from 'express';

export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(403);
    res.end();
  } else {
    next();
  }
}

export function checkSuperuser(req: Request, res: Response, next: NextFunction) {
  if (req) {
    res.status(403);
    res.end();
  } else {
    next();
  }
}
