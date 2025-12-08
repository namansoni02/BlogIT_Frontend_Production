/**
 * ProfilePage.jsx
 * ----------------
 * Displays user profile with stats and list of posts
 */

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PostBox from "../components/post/postBox";
import { getUserProfile } from "../services/ProfileService";
import { followUser, unfollowUser } from "../services/FollowService";
import { AuthContext } from "../context/AuthContext";
import { Users, FileText, Heart, Eye, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(username);
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {profileData.username.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">{profileData.username}</h1>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isFollowing
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              
              <p className="text-slate-600 mb-4">{profileData.email}</p>
              
              {profileData.userBio && (
                <p className="text-slate-700 mb-6">{profileData.userBio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(profileData.stats.followers)}
                  </div>
                  <div className="text-sm text-slate-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(profileData.stats.following)}
                  </div>
                  <div className="text-sm text-slate-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(profileData.stats.posts)}
                  </div>
                  <div className="text-sm text-slate-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(profileData.stats.likes)}
                  </div>
                  <div className="text-sm text-slate-500">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(profileData.stats.views)}
                  </div>
                  <div className="text-sm text-slate-500">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {isOwnProfile ? "Your Posts" : `${profileData.username}'s Posts`}
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No posts yet</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/create-post")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostBox key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
