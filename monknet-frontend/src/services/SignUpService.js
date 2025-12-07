/**
 * SignUpService.js
 * ----------------
 * Service responsible for executing registration API requests.
 * Abstracts away API communication from the UI layer.
 */

import axios from "axios";
import { SignUpEndpoint } from "../api/APIEndpoints";

/**
 * Registers a new user account.
 *
 * @param {string} username - Desired unique username for new account
 * @param {string} email - Valid email address associated with user account
 * @param {string} password - User's raw password (hashed securely on backend)
 * @returns {Promise<Object>} API response containing a success message if registered,
 *                            or an error message for validation/server issues.
 */
async function SignUpService(username, email, password) {
  try {
    // Execute HTTP POST request to backend
    const response = await axios.post(SignUpEndpoint, {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    // Log detailed error information to dev console
    console.error("Signup Error:", error.response?.data || error.message);

    // Return normalized error response for UI handling
    return error.response?.data || { message: "Server error occurred" };
  }
}

export { SignUpService };
