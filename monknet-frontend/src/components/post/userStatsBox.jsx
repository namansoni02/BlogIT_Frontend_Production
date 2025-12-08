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
    <div className="card-twitter">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#0f1419] p-4 pb-3">Your Profile</h2>
      
      {/* Followers and Following Stats */}
      <div className="px-4 pb-4 border-b border-[#eff3f4]">
        <button
          onClick={() => navigate(`/profile/${userName}`)}
          className="flex gap-4 hover:underline"
        >
          <div>
            <span className="font-bold text-[#0f1419]">{formatNumber(following)}</span>
            <span className="text-[#536471] text-sm ml-1">Following</span>
          </div>
          <div>
            <span className="font-bold text-[#0f1419]">{formatNumber(followers)}</span>
            <span className="text-[#536471] text-sm ml-1">Followers</span>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        {/* Posts */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#536471]">Posts</span>
          <span className="font-semibold text-[#0f1419]">{formatNumber(postsCount)}</span>
        </div>

        {/* Likes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#536471]">Total Likes</span>
          <span className="font-semibold text-[#0f1419]">{formatNumber(likes)}</span>
        </div>

        {/* Views */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#536471]">Profile Views</span>
          <span className="font-semibold text-[#0f1419]">{formatNumber(views)}</span>
        </div>
      </div>

      {/* View Profile Button */}
      <div className="p-4 pt-0">
        <button 
          onClick={() => navigate(`/profile/${userName}`)}
          className="w-full btn-twitter"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
