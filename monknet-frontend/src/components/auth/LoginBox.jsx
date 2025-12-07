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

export default function LoginBox() {
  const navigate = useNavigate();

  // Controlled input state for login credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Sends login request to backend via service.
   * On success: saves token & redirects to feed.
   * On failure: displays backend-provided error message.
   */
  const handleLogin = async () => {
    const data = await LoginService(username, password);

    if (data?.token) {
      sessionStorage.setItem("token", data.token);
      navigate("/feed");

      console.info("Auth success: token stored in sessionStorage.");
    } else {
      console.warn("Auth failed:", data.message);
      alert(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">MonkNet Login</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          className="btn btn-primary w-full mb-3"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
