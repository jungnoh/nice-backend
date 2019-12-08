import { User as UserModel } from '../models/user';

declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserModel;
    }
  }
}
