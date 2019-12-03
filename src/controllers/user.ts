import {Request, Response} from 'express';
import * as UserService from '../services/user';

export async function login(req: Request, res: Response) {
  // TODO: This is kind of a placeholder just to make the linter happy
  res.json(await UserService.authenticate(req.body.username, req.body.password));
}
