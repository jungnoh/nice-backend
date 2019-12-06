import {Router} from 'express';
import {checkSuperuser} from '../middlewares/auth';

const rootRouter = Router({caseSensitive: false}); // just in case..
// Router for administrative actions
const adminRouter = Router();
adminRouter.use(checkSuperuser);

const userRouter = Router();

rootRouter.use('/admin', adminRouter);
rootRouter.use(userRouter);
export default rootRouter;
