import jwt from 'jsonwebtoken';

// Google OAuth Success Callback
export const googleAuthCallback = (req, res) => {
  try {
    // User is authenticated via Passport
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect to frontend with token
    // Frontend will capture this token from URL and store it
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&userId=${user._id}`);
  } catch (error) {
    console.error('Google Auth Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};

// Google Auth Failure
export const googleAuthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
};
