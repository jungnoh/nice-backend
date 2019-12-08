import {NextFunction, Request, Response} from 'express';

export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    res.status(403);
    res.json({success: false});
  } else {
    next();
  }
}

export function checkSuperuser(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser || !req.currentUser.isSuperuser) {
    res.status(403);
    res.json({success: false});
  } else {
    next();
  }
}
