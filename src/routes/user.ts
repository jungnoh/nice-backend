import {Router} from 'express';
import {check} from 'express-validator';
import * as UserController from '../controllers/user';

const router = Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Request Login
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Login success
 *       403:
 *         description: Login fail
 */
router.post('/login', [
  check('username').exists(),
  check('password').exists()
], UserController.login)

export default router
