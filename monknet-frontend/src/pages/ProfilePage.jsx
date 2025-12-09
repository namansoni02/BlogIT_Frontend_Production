/**
 * ProfilePage.jsx
 * ----------------
 * Displays user profile with stats and list of posts
 */

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PostBox from "../components/post/postBox";
import ProfileFactBox from "../components/common/ProfileFactBox";
import FactBox from "../components/common/FactBox";
import ExtinctAnimalFact from "../components/common/ExtinctAnimalFact";
import { getUserProfile } from "../services/ProfileService";
import { followUser, unfollowUser } from "../services/FollowService";
import { updateProfileImage } from "../services/UpdateProfileImageService";
import UserDetailsFetching from "../services/UserDetailsFetchingService";
import { AuthContext } from "../context/AuthContext";
import { Users, FileText, Heart, Eye, ArrowLeft, Camera } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(username);
        //console.log("Profile data received:", data);
        //console.log("Profile image URL:", data.user?.profileImage);
        // console.log("Storing profile image in sessionStorage:", data.user?.profileImage);
        // const fetchedProfileImage=sessionStorage.getItem("userProfilePicture");
        // console.log("Fetched profile image from sessionStorage:", fetchedProfileImage);
        localStorage.setItem("userProfilePicture", data.user?.profileImage || "");
        setProfileData(data.user);
        setPosts(data.posts || []);
        
        // Check if current user is following this user
        // This would need to be implemented based on your backend
        // For now, we'll set it to false
        setIsFollowing(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileData._id);
        setIsFollowing(false);
        // Update follower count
        setProfileData(prev => ({
          ...prev,
          stats: { ...prev.stats, followers: prev.stats.followers - 1 }
        }));
      } else {
        await followUser(profileData._id);
        setIsFollowing(true);
        // Update follower count
        setProfileData(prev => ({
          ...prev,
          stats: { ...prev.stats, followers: prev.stats.followers + 1 }
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleUpdateProfileImage = async () => {
    if (!newImageUrl.trim()) {
      alert("Please enter a valid image URL");
      return;
    }

    try {
      setUpdating(true);
      await updateProfileImage(newImageUrl);
      
      // Refetch user data to update sessionStorage
      await UserDetailsFetching();
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        profileImage: newImageUrl
      }));
      
      setShowImageModal(false);
      setNewImageUrl("");
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-xl text-slate-600 mb-4">User not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="container-twitter">
      <Navbar />
      
      {/* Center Feed */}
      <div className="feed-twitter">
        {/* Feed Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#eff3f4]">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#0f1419] hover:text-[#536471] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Profile</span>
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="overflow-y-auto">
          {/* Profile Header */}
          <div className="bg-white border-b border-[#eff3f4] p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage}
                  alt={profileData.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#1d9bf0] shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  {profileData.username.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Edit Button - Only show for own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors border-2 border-white shadow-lg"
                  title="Change profile picture"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold text-[#0f1419]">{profileData.username}</h1>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      isFollowing
                        ? "bg-[#eff3f4] text-[#0f1419] hover:bg-[#d7dbdc]"
                        : "bg-[#0f1419] text-white hover:bg-[#272c30]"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              
              <p className="text-[#536471] mb-4">{profileData.email}</p>
              
              {profileData.userBio && (
                <p className="text-[#0f1419] mb-4">{profileData.userBio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center md:text-left">
                  <span className="text-[#0f1419] font-bold">
                    {formatNumber(profileData.stats.followers)}
                  </span>
                  <span className="text-[#536471] text-sm ml-1">Followers</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[#0f1419] font-bold">
                    {formatNumber(profileData.stats.following)}
                  </span>
                  <span className="text-[#536471] text-sm ml-1">Following</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[#0f1419] font-bold">
                    {formatNumber(profileData.stats.posts)}
                  </span>
                  <span className="text-[#536471] text-sm ml-1">Posts</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[#0f1419] font-bold">
                    {formatNumber(profileData.stats.likes)}
                  </span>
                  <span className="text-[#536471] text-sm ml-1">Likes</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[#0f1419] font-bold">
                    {formatNumber(profileData.stats.views)}
                  </span>
                  <span className="text-[#536471] text-sm ml-1">Views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white">
          <div className="p-4 border-b border-[#eff3f4]">
              <h2 className="text-xl font-bold text-[#0f1419]">
                {isOwnProfile ? "Your Posts" : `${profileData.username}'s Posts`}
              </h2>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FileText className="w-16 h-16 text-[#536471] mx-auto mb-4 opacity-50" />
                <p className="text-[#536471] text-base">No posts yet</p>
                <p className="text-[#536471] text-base">No posts yet</p>
                {isOwnProfile && (
                  <button
                    onClick={() => navigate("/create-post")}
                    className="mt-4 px-6 py-2 bg-[#1d9bf0] text-white rounded-full font-bold hover:bg-[#1a8cd8] transition-all"
                  >
                    Create Your First Post
                  </button>
                )}
              </div>
            ) : (
              <div>
                {posts.map((post) => (
                  <PostBox key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Widgets */}
      <div className="widgets-twitter">
        <ProfileFactBox />
        <FactBox />
        <ExtinctAnimalFact />
      </div>

      {/* Update Profile Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black">
            <h2 className="text-xl font-bold text-black mb-4">Update Profile Picture</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                  placeholder="https://example.com/your-image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>

              {/* Image Preview */}
              {newImageUrl && (
                <div className="flex justify-center">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-black"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfileImage}
                  disabled={updating || !newImageUrl.trim()}
                  className="flex-1 bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setNewImageUrl("");
                  }}
                  disabled={updating}
                  className="flex-1 bg-white text-black px-4 py-2 rounded font-bold border-2 border-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
