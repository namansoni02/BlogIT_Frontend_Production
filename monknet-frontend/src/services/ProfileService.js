/**
 * ProfileService.js
 * ------------------
 * Service for fetching user profile data by username
 */

import axios from "axios";
import { GetUserByUsernameEndpoint } from "../api/APIEndpoints";

/**
 * Fetches user profile data by username
 * @param {string} username - Username to fetch profile for
 * @returns {Promise<Object>} User profile data with posts
 */
export const getUserProfile = async (username) => {
  try {
    const response = await axios.get(`${GetUserByUsernameEndpoint}/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

export default { getUserProfile };
