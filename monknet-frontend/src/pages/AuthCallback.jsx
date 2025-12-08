/**
 * AuthCallback.jsx
 * -----------------
 * Handles OAuth callback and token processing
 */

import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleCallback } from "../services/GoogleAuthService";
import { AuthContext } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = () => {
      const result = handleGoogleCallback();

      if (result.success) {
        // Store token in session storage
        sessionStorage.setItem("token", result.token);
        setToken(result.token);
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } else {
        // Handle error
        alert(`Authentication failed. Please try again.`);
        navigate("/login", { replace: true });
      }
    };

    processCallback();
  }, [navigate, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">Completing sign in...</p>
        </div>
      </div>
    </div>
  );
}
