/**
 * UpdateProfileImageService.js
 * -----------------------------
 * Service for updating user profile image URL
 */

const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

/**
 * Updates the user's profile image URL
 * 
 * @param {string} profileImageUrl - The new profile image URL
 * @returns {Promise<Object>} Response with success message or error
 */
export async function updateProfileImage(profileImageUrl) {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BackendURL}/user/update-profile-image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ profileImage: profileImageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile image");
    }

    return data;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
}
