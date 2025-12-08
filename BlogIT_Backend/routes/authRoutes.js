import express from 'express';
import {registerUser} from '../controllers/userRegister.js';
import {loginUser} from '../controllers/userLogin.js';
import passport from '../config/passport.js';
import { googleAuthCallback, googleAuthFailure } from '../controllers/googleAuth.js';

const router = express.Router();

// Traditional auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/google/failure',
    session: false 
  }),
  googleAuthCallback
);

router.get('/google/failure', googleAuthFailure);

export default router;