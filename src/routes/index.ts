import {Router} from 'express';

import BoardRouter from './board';
import UserRouter from './user';

const router = Router();

router.get('/', (_, res) => {
  res.status(200);
  res.send('Hello world!!');
});

router.use('/user', UserRouter);
router.use('/board', BoardRouter);

export default router;
