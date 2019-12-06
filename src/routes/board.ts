import {Router} from 'express';
import {check} from 'express-validator';
import * as BoardController from '../controllers/board';
import {checkSuperuser} from '../middlewares/auth';
import {rejectValFail} from '../middlewares/validate';

const boardKeyRegex = /^[0-9a-zA-Z\-]+$/;

const rootRouter = Router({caseSensitive: false}); // just in case..
// Router for administrative actions
const adminRouter = Router();
adminRouter.use(checkSuperuser);
const userRouter = Router();

adminRouter.post('/board/create', [
  check('key').exists().matches(boardKeyRegex),
  check('visibleName').exists().isString()
], rejectValFail, BoardController.createBoard);

adminRouter.put('/board/rename', [
  check('key').exists().matches(boardKeyRegex),
  check('newName').exists().isString()
], rejectValFail, BoardController.renameBoard);

userRouter.get('/:key/list', [
  check('key').exists().matches(boardKeyRegex),
  check('page').isInt({min: 1}).toInt()
], rejectValFail, BoardController.listBoard);

userRouter.post('/:key/write', [
  check('key').exists().matches(boardKeyRegex),
  check('title').exists().isString().trim(),
  check('content').exists()
], rejectValFail, BoardController.writePost);

userRouter.get('/:key/:postID', [
  check('key').exists().matches(boardKeyRegex),
  check('postID').exists().isMongoId()
], rejectValFail, BoardController.getPost);

rootRouter.use('/admin', adminRouter);
rootRouter.use(userRouter);
export default rootRouter;
