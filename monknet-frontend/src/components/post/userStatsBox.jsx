import { Users, FileText, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * UserStatsBox Component
 * 
 * Displays user statistics in a visually appealing card format for the dashboard.
 * Shows key metrics like followers, postsCount, total likes, and profile views.
 * 
 * @param {Object} props - Component props
 * @param {number} props.followers - Number of followers (default: 0)
 * @param {number} props.following - Number of accounts being followed (default: 0)
 * @param {number} props.postsCount - Total number of postsCount created (default: 0)
 * @param {number} props.likes - Total likes received across all postsCount (default: 0)
 * @param {number} props.views - Total profile views (default: 0)
 * @param {string} props.userName - User's display name (optional)
 * @param {string} props.userBio - User's bio/description (optional)
 * 
 * @example
 * <UserStatsBox 
 *   userName="John Doe"
 *   userBio="Software Developer | Tech Enthusiast"
 *   followers={1234}
 *   following={567}
 *   postsCount={89}
 *   likes={4567}
 *   views={12345}
 * />
 */
export default function UserStatsBox({ 
  data
}) {
  const navigate = useNavigate();
  //console.log("UserStatsBox data:", data);
  /**
   * Formats large numbers into readable format (e.g., 1.2K, 5.4M)
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  
  // Extract data from the user object
  // Backend sends: { username, email, posts: [{title, _id}], stats: {followers, following, posts, likes, views}, userBio }
  const userName = data?.username || '';
  const userBio = data?.userBio || '';
  
  // Get stats from the stats object
  const followers = data?.stats?.followers || 0;
  const following = data?.stats?.following || 0;
  const postsCount = data?.stats?.posts || 0;
  const likes = data?.stats?.likes || 0;
  const views = data?.stats?.views || 0;
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 animate-fade-in">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-6">
        {/* User Avatar with gradient background - clickable */}
        <button
          onClick={() => navigate(`/profile/${userName}`)}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </button>
        
        {/* User Name - clickable */}
        {userName && (
          <button
            onClick={() => navigate(`/profile/${userName}`)}
            className="text-xl font-bold text-gray-900 mb-1 hover:text-purple-600 transition-colors"
          >
            {userName}
          </button>
        )}
        
        {/* User Bio */}
        {userBio && (
          <p className="text-sm text-gray-500 text-center">{userBio}</p>
        )}
      </div>

      {/* Followers and Following Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
        {/* Followers Count */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatNumber(followers)}</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        
        {/* Following Count */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatNumber(following)}</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
      </div>

      {/* Detailed Statistics Grid */}
      <div className="space-y-3">
        {/* postsCount Stat */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <span className="font-medium text-gray-700">postsCount</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{formatNumber(postsCount)}</span>
        </div>

        {/* Likes Stat */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-medium text-gray-700">Total Likes</span>
          </div>
          <span className="text-lg font-bold text-red-600">{formatNumber(likes)}</span>
        </div>

        {/* Views Stat */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Eye size={20} className="text-white" />
            </div>
            <span className="font-medium text-gray-700">Profile Views</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{formatNumber(views)}</span>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button 
        onClick={() => navigate(`/profile/${userName}`)}
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover-lift"
      >
        Edit Profile
      </button>
    </div>
  );
}
