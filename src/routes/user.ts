import {Router} from 'express';
import passport from 'passport';

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
router.post('/login', passport.authenticate('local'), (_, res) => {
  res.status(200).json({success: true});
});

export default router;
