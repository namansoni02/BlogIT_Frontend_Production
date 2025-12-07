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

export default function SignupBox() {
  const navigate = useNavigate();

  // Controlled fields for registration input collection
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles user signup by delegating API communication to SignUpService.
   * On success: redirect to login screen.
   * On failure: surface backend validation responses.
   */
  const handleSignUp = async () => {
    const data = await SignUpService(username, email, password);

    if (data.message === "User registered successfully") {
      console.info("Registration successful — redirecting user to login.");
      navigate("/login");
    } else {
      console.warn("Registration failed:", data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-full mb-3" onClick={handleSignUp}>
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
