import {Router} from 'express';
import passport from 'passport';
import {sanitizeUserObj} from '../services/user';

const router = Router();

router.post('/login', passport.authenticate('local'), (_, res) => {
  res.status(200).json({success: true});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({success: true});
});

router.get('/me', (req, res) => {
  if (!req.currentUser) {
    res.status(200).json({me: {}, success: true});
  } else {
    res.status(200).json({
      me: sanitizeUserObj(req.currentUser),
      success: true
    });
  }
});

export default router;
