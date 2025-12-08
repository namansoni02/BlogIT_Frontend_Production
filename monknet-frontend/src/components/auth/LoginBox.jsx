/**
 * LoginBox.jsx
 * ------------
 * Authentication form allowing users to log into the MonkNet application.
 * Responsibilities:
 *  - Collect user credentials
 *  - Trigger backend login request
 *  - Persist JWT token in session storage
 *  - Redirect authenticated users to the feed page
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginService } from "../../services/LoginService";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { initiateGoogleAuth } from "../../services/GoogleAuthService";
import logo from "../../assets/logo.png";

export default function LoginBox() {
  const navigate = useNavigate();

  // Controlled input state for login credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);

  /**
   * Sends login request to backend via service.
   * On success: saves token & redirects to feed.
   * On failure: displays backend-provided error message.
   */
  const handleLogin = async () => {
    const data = await LoginService(username, password);

    if (data?.token) {
      //console.log(data.token);
      sessionStorage.setItem("token", data.token);
      // Using the AuthContext to set the token, this updates the context and triggers any necessary re-renders
      setToken(data.token);

      navigate("/dashboard");

      console.info("Auth success: token stored in sessionStorage.");
    } else {
      console.warn("Auth failed:", data.message);
      alert(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border-2 border-black p-8 rounded-lg">
        {/* MonkNet Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="MonkNet" className="w-40 h-40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0f1419]">Sign in to MonkNet</h1>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-[#0f1419] text-sm focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white border border-[#cfd9de] rounded text-[#0f1419] text-sm focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] outline-none transition-colors"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="w-full bg-[#0f1419] text-white font-bold py-2 text-sm rounded hover:bg-[#272c30] transition-colors"
            onClick={handleLogin}
          >
            Sign In
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

          {/* Google Sign-In Button */}
          <button
            className="w-full bg-white border border-[#cfd9de] text-[#0f1419] font-bold py-2 text-sm rounded hover:bg-[#e7e9ea] transition-colors flex items-center justify-center gap-2"
            onClick={initiateGoogleAuth}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#536471]">
            Don't have an account?{" "}
          </span>
          <button
            className="text-[#1d9bf0] font-normal hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
