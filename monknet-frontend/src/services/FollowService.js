/**
 * FollowService.js
 * -----------------
 * Service for following/unfollowing users
 */

import axios from "axios";
import { FollowUserEndpoint, UnfollowUserEndpoint } from "../api/APIEndpoints";

/**
 * Follow a user
 * @param {string} userId - ID of the user to follow
 * @returns {Promise<Object>} Response from server
 */
export const followUser = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${FollowUserEndpoint}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error following user:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Unfollow a user
 * @param {string} userId - ID of the user to unfollow
 * @returns {Promise<Object>} Response from server
 */
export const unfollowUser = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${UnfollowUserEndpoint}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error.response?.data || error.message);
    throw error;
  }
};

export default { followUser, unfollowUser };
