/**
 * LoginService.js
 * ----------------
 * Handles sending login request to backend API.
 * Returns response data such as JWT token and user details if successful.
 */

import axios from "axios";
import { LoginEndpoint } from "../api/APIEndpoints";

/**
 * Sends login request to backend
 *
 * @param {string} username - The username used for login
 * @param {string} password - The user's password (plain text, backend will hash/compare)
 * @returns {Promise<Object>} Response data containing token or error message
 */
async function LoginService(username, password) {
  try {
    // Make POST request with user credentials
    const response = await axios.post(LoginEndpoint, {
      username,
      password,
    });

    return response.data; // expected: { token, userId, message }
  } catch (error) {
    // Log complete error for debugging purposes
    console.error("Login Error:", error.response?.data || error.message);

    // Return clean error object to frontend UI
    return (
      error.response?.data || {
        error: "Server Error - Unable to login",
      }
    );
  }
}

export { LoginService };
