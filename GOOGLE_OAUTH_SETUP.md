# Google OAuth Setup Instructions

## Overview
This application now supports Google Sign-In/Sign-Up functionality alongside traditional email/password authentication.

## Backend Setup

### 1. Install Dependencies
The required packages have been installed:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth 2.0 strategy
- `express-session` - Session management

### 2. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: BlogIT (or your app name)
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email`, `profile`
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173` (Frontend)
     - `http://localhost:3000` (Backend)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### 3. Update Environment Variables

Update your `.env` file in the `BlogIT_Backend` directory with the credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173

# Session Secret (generate a random secure string)
SESSION_SECRET=your-secure-random-session-secret-here
```

### 4. Backend Files Created/Modified

- **`config/passport.js`** - Passport Google OAuth strategy configuration
- **`controllers/googleAuth.js`** - Google authentication callbacks
- **`routes/authRoutes.js`** - Added Google OAuth routes
- **`index.js`** - Integrated Passport middleware

## Frontend Setup

### 1. Frontend Files Created

- **`services/GoogleAuthService.js`** - Handles Google OAuth flow
- **`pages/AuthCallback.jsx`** - Processes OAuth callback
- **`services/UsersService.js`** - Fetch all users
- **`services/FollowService.js`** - Follow/unfollow functionality
- **`services/ProfileService.js`** - User profile data
- **`pages/ProfilePage.jsx`** - User profile view
- **`pages/UsersPage.jsx`** - Browse all users

### 2. Updated Components

- **`components/auth/LoginBox.jsx`** - Added Google Sign-In button
- **`components/auth/SignupBox.jsx`** - Added Google Sign-Up button
- **`components/common/Navbar.jsx`** - Added Users link and Profile navigation
- **`components/post/userStatsBox.jsx`** - Made username clickable to profile
- **`App.jsx`** - Added new routes

## API Endpoints

### Google OAuth
- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/google/failure` - Handles OAuth failure

### User Management
- `GET /api/user/allusers` - Get all users (protected)
- `GET /api/user/:username` - Get user profile by username
- `POST /api/user/follow/:userIdToFollow` - Follow a user (protected)
- `POST /api/user/unfollow/:userIdToUnfollow` - Unfollow a user (protected)

## New Features

### 1. Google Authentication
- Users can sign in/up with their Google account
- Automatic account creation for new Google users
- Seamless JWT token generation

### 2. Profile Page
- View user stats (followers, following, posts, likes, views)
- Display user's posts
- Follow/unfollow functionality
- Accessible at `/profile/:username`

### 3. Users Page
- Browse all users on the platform
- Search users by username or email
- Follow/unfollow users directly
- View follower/following counts
- Accessible at `/users`

### 4. Enhanced Navigation
- **Explore** - View all posts (Dashboard)
- **Users** - Browse all users
- **Post** - Create new post
- **Profile** - View own profile (dropdown menu)

## How to Use

### Starting the Application

1. **Start Backend:**
   ```bash
   cd BlogIT_Backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd monknet-frontend
   npm run dev
   ```

### User Flow

1. **Sign In/Up:**
   - Traditional: Use username/email and password
   - Google: Click "Sign in with Google" button

2. **Browse Users:**
   - Click "Users" in navbar
   - Search for specific users
   - Follow/unfollow users

3. **View Profiles:**
   - Click on any username
   - View user's posts and stats
   - Follow/unfollow from profile

4. **Your Profile:**
   - Click avatar in navbar
   - Select "Profile" from dropdown
   - View your stats and posts

## Security Notes

- Never commit your `.env` file with real credentials
- Keep `GOOGLE_CLIENT_SECRET` secure
- Use strong `SESSION_SECRET` in production
- Update redirect URIs for production deployment

## Production Deployment

When deploying to production:

1. Update `GOOGLE_CALLBACK_URL` to your production backend URL
2. Update `FRONTEND_URL` to your production frontend URL
3. Add production URLs to Google Cloud Console authorized URIs
4. Use environment-specific `.env` files
5. Enable HTTPS for secure OAuth flow

## Troubleshooting

### Google OAuth not working:
- Verify Client ID and Secret are correct
- Check redirect URIs match exactly
- Ensure Google+ API is enabled
- Clear browser cookies/cache

### Follow/Unfollow not working:
- Ensure user is authenticated
- Check JWT token is valid
- Verify API endpoints are correct

### Profile page not loading:
- Check username in URL is correct
- Verify user exists in database
- Check network requests in browser console

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Express Session](https://github.com/expressjs/session)
