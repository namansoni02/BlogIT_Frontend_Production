/**
 * GoogleAuthService.js
 * ----------------------
 * Handles Google OAuth authentication flow
 */

const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

/**
 * Initiates Google OAuth flow by redirecting to backend
 */
export const initiateGoogleAuth = () => {
  window.location.href = `${BackendURL}/auth/google`;
};

/**
 * Handles OAuth callback from Google
 * Extracts token from URL parameters
 */
export const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userId = urlParams.get('userId');
  const error = urlParams.get('error');

  if (error) {
    console.error('Google Auth Error:', error);
    return { success: false, error };
  }

  if (token && userId) {
    return { success: true, token, userId };
  }

  return { success: false, error: 'no_token' };
};

export default { initiateGoogleAuth, handleGoogleCallback };
