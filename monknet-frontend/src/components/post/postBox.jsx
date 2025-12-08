import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import likePostService from '@/services/likePostService';
/**
 * PostBox Component
 * 
 * A reusable post card component that displays user posts with interactive features.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data object from MongoDB
 * @param {string} props.post._id - Post unique identifier
 * @param {Object} props.post.author - Author object with _id, username, email
 * @param {string} props.post.author.username - Author's username
 * @param {string} props.post.author.email - Author's email
 * @param {number} props.post.comments - Number of comments (default: 0)
 * @param {string} props.post.content - Main post content/text
 * @param {string} props.post.createdAt - ISO timestamp of post creation
 * @param {number} props.post.likes - Number of likes (default: 0)
 * @param {number} props.post.shares - Number of shares (default: 0)
 * @param {string} props.post.title - Post title
 * @param {string} props.post.updatedAt - ISO timestamp of last update
 * 
 * @example
 * <PostBox post={{
 *   _id: "60362b7c0be8ef45f00854e8",
 *   author: {
 *     _id: "60362b7c0be8ef45f00854e8",
 *     username: "naman",
 *     email: "naman@gmail.com"
 *   },
 *   content: "Just some Dev and CD",
 *   createdAt: "2025-12-06T18:57:15.460Z",
 *   likes: 0,
 *   comments: 0,
 *   shares: 0,
 *   title: "How is Vacations Going ON",
 *   updatedAt: "2025-12-06T18:57:15.460Z"
 * }} />
 */
export default function PostBox({ post }) {
  // State for tracking if current user has liked the post
  // Get user data from sessionStorage and check if this post is in likedPosts array
  const getUserData = () => {
    const userData = sessionStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };
  
  const userData = getUserData();
  // likedPosts is an array of post IDs that the user has liked
  const likedPosts = userData?.likedPosts || [];
  const alreadyLiked = likedPosts.includes(post._id);

  const [liked, setLiked] = useState(alreadyLiked);
  
  // State for tracking if current user has bookmarked the post
  const [bookmarked, setBookmarked] = useState(false);
  
  // State for managing likes count (can increase/decrease based on user action)
  const [likesCount, setLikesCount] = useState(post?.likes || 0);

  /**
   * Formats ISO timestamp to relative time (e.g., "2 hours ago")
   * @param {string} isoDate - ISO 8601 date string
   * @returns {string} Formatted relative time
   */
  const formatTimestamp = (isoDate) => {
    if (!isoDate) return 'Just now';
    
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  /**
   * Handles like button click
   * Toggles like state and updates likes count accordingly
   */
  const handleLike = () => {
    if (liked) {
      likePostService(post._id, false); // unlike post
      setLikesCount(likesCount - 1);
      
      // Update sessionStorage - remove from likedPosts
      const userData = getUserData();
      if (userData && userData.likedPosts) {
        userData.likedPosts = userData.likedPosts.filter(id => id !== post._id);
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    } else {
      likePostService(post._id, true); // like post
      setLikesCount(likesCount + 1);
      
      // Update sessionStorage - add to likedPosts
      const userData = getUserData();
      if (userData) {
        if (!userData.likedPosts) {
          userData.likedPosts = [];
        }
        userData.likedPosts.push(post._id);
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    }
    setLiked(!liked);
  };

  /**
   * Handles bookmark button click
   * Toggles bookmark state for saving posts
   */
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 mb-3">
      {/* Post Header - Shows author info and options menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Author Avatar - Shows first letter of author's username with gradient background */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
            {post?.author?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          {/* Author Name and Timestamp */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{post?.author?.username || 'Anonymous'}</h3>
            <p className="text-xs text-gray-500">{formatTimestamp(post?.createdAt)}</p>
          </div>
        </div>
        {/* More Options Button - For edit, delete, report, etc. */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Post Content - Main text and optional title */}
      <div className="mb-3">
        {/* Post Title */}
        {post?.title && (
          <h2 className="text-base font-bold text-gray-900 mb-1">{post.title}</h2>
        )}
        {/* Post Content Text */}
        <p className="text-sm text-gray-700 leading-relaxed">{post?.content || 'No content available'}</p>
      </div>

      {/* Post Stats - Shows engagement metrics */}
      <div className="flex items-center gap-4 py-2 border-t border-gray-100 text-xs text-gray-500">
        <span>{likesCount} likes</span>
        <span>{post?.comments || 0} comments</span>
        <span>{post?.shares || 0} shares</span>
      </div>

      {/* Action Buttons - Interactive buttons for user engagement */}
      <div className="flex items-center justify-around pt-2 border-t border-gray-100">
        {/* Like Button - Changes color and fills heart icon when liked */}
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 ${
            liked 
              ? 'text-red-500' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart 
            size={16} 
            fill={liked ? 'currentColor' : 'none'}
          />
          <span className="text-xs font-medium">Like</span>
        </button>

        {/* Comment Button - Opens comment section (to be implemented) */}
        <button className="flex items-center gap-1 px-2 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <MessageCircle size={16} />
          <span className="text-xs font-medium">Comment</span>
        </button>

        {/* Share Button - Opens share dialog (to be implemented) */}
        <button className="flex items-center gap-1 px-2 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <Share2 size={16} />
          <span className="text-xs font-medium">Share</span>
        </button>

        {/* Bookmark Button - Saves post for later, fills icon when bookmarked */}
        <button 
          onClick={handleBookmark}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 ${
            bookmarked 
              ? 'text-blue-500' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark 
            size={16} 
            fill={bookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </div>
  );
}