import {Request, Response} from 'express';
import * as UserService from '../services/user';

/**
 * @description Controller for `GET /me`
 */
export async function me(req: Request, res: Response) {
  if (!req.currentUser) {
    res.status(200).json({
      loggedIn: false,
      me: {},
      success: true
    });
  } else {
    res.status(200).json({
      loggedIn: true,
      me: UserService.sanitizeUserObj(req.currentUser),
      success: true
    });
  }
}

/**
 * @description Controller for `POST /signup`
 */
export async function signup(req: Request, res: Response) {
  try {
    await UserService.createUser(req.body.email, req.body.username, req.body.password);
    res.status(200).json({
      success: true
    });
  } catch (err) {
    if (err === UserService.EMAIL_EXISTS || err === UserService.USERNAME_EXISTS) {
      res.status(409).json({
        reason: err,
        success: false
      });
    } else {
      // TODO: log error
      res.status(500).json({
        success: false
      });
    }
  }
}
