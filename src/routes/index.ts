import {Router} from 'express';

import UserRouter from './user';

const router = Router();

router.get('/', (_, res) => {
  res.status(200);
  res.send('Hello world!!');
});

router.use('/user', UserRouter);

export default router;
