import {Router} from 'express';
import {check} from 'express-validator';
import passport from 'passport';
import * as UserController from '../controllers/user';
import {checkLoggedOut, checkSuperuser} from '../middlewares/auth';
import { rejectValFail } from '../middlewares/validate';

const router = Router();
const userRouter = Router();
const adminRouter = Router();
adminRouter.use(checkSuperuser);

userRouter.post('/signup', [
  check('username').exists(),
  check('password').exists(),
  check('email').exists().isEmail()
], rejectValFail, checkLoggedOut, UserController.signup);

userRouter.post('/login',
  passport.authenticate('local', {failWithError: true}),
  (_, res) => {
    res.status(200).json({success: true});
  }
);

userRouter.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({success: true});
});

userRouter.get('/me', UserController.me);

router.use('/admin', adminRouter);
router.use(userRouter);
export default router;
