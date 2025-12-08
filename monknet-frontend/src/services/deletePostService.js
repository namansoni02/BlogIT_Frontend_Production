import { DeletePostEndpoint } from "../api/APIEndpoints";

/**
 * Delete a post
 * @param {string} postId - The ID of the post to delete
 * @returns {Promise<Object>} Response data from the server
 */
const deletePostService = async (postId) => {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${DeletePostEndpoint}/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete post");
    }

    return data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export default deletePostService;
