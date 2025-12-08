/**
 * UsersService.js
 * ----------------
 * Service for fetching all users on the platform
 */

import { GetAllUsersEndpoint } from "../api/APIEndpoints";

/**
 * Fetches all users from the platform
 * @returns {Promise<Array>} List of all users
 */
export const getAllUsers = async () => {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      console.error("No authentication token found");
      return [];
    }

    const response = await fetch(GetAllUsersEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch users:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default { getAllUsers };
