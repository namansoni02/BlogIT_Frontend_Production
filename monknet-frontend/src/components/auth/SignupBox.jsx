/**
 * SignupBox.jsx
 * --------------------
 * UI component for user registration.
 * 
 * Responsibilities:
 *  - Manage registration form state
 *  - Call SignUpService to register a new user
 *  - Redirect user to login page upon successful registration
 * 
 * Notes:
 *  - Token is intentionally NOT stored here since sign-in is required post-registration
 *  - Error visibility handled via console logs for development clarity
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SignUpService } from "../../services/SignUpService";
import { initiateGoogleAuth } from "../../services/GoogleAuthService";
import logo from "../../assets/logo.png";

export default function SignupBox() {
  const navigate = useNavigate();

  // Controlled fields for registration input collection
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles user signup by delegating API communication to SignUpService.
   * On success: redirect to login screen.
   * On failure: surface backend validation responses.
   */
  const handleSignUp = async () => {
    // Clear previous error
    setErrorMessage("");

    // Basic validation
    if (!username || !email || !password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    const data = await SignUpService(username, email, password, profileImage);

    if (data.message === "User registered successfully") {
      console.info("Registration successful — redirecting user to login.");
      navigate("/login");
    } else {
      // Display error message to user
      setErrorMessage(data.message || "Registration failed. Please try again.");
      console.warn("Registration failed:", data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border-2 border-black p-8 rounded-lg">
        {/* MonkNet Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="MonkNet" className="w-32 h-32 mx-auto mb-4 select-none pointer-events-none" />
          <h1 className="text-2xl font-bold text-black">Join MonkNet today</h1>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-black text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              placeholder="Username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-black text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-black text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Profile Picture URL (Optional)</label>
            <input
              type="url"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-black text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              placeholder="https://example.com/your-image.jpg"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
            {profileImage && (
              <div className="mt-2">
                <img 
                  src={profileImage} 
                  alt="Profile preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-black"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <button
            className="w-full bg-black text-white font-bold py-2 text-sm rounded hover:bg-gray-800 transition-colors"
            onClick={handleSignUp}
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eff3f4]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#536471]">or</span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <button
            className="w-full bg-white border border-[#cfd9de] text-black font-bold py-2 text-sm rounded hover:bg-[#e7e9ea] transition-colors flex items-center justify-center gap-2"
            onClick={initiateGoogleAuth}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#536471]">
            Already have an account?{" "}
          </span>
          <button
            className="text-black font-bold hover:underline"
            onClick={() => navigate("/")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
