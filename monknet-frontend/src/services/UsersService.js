/**
 * UsersService.js
 * ----------------
 * Service for fetching all users on the platform
 */

import axios from "axios";
import { GetAllUsersEndpoint } from "../api/APIEndpoints";

/**
 * Fetches all users from the platform
 * @returns {Promise<Array>} List of all users
 */
export const getAllUsers = async () => {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(GetAllUsersEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.users || [];
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

export default { getAllUsers };
