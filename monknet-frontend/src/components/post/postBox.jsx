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
    <div className="post-card">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Author Avatar */}
          <div className="avatar-twitter flex-shrink-0">
            {post?.author?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#0f1419] hover:underline cursor-pointer">
                {post?.author?.username || 'Anonymous'}
              </h3>
              <span className="text-[#536471]">·</span>
              <span className="text-[#536471] text-sm">{formatTimestamp(post?.createdAt)}</span>
            </div>

            {/* Post Title & Content */}
            {post?.title && (
              <h2 className="text-lg font-bold text-[#0f1419] mb-2">{post.title}</h2>
            )}
            <p className="text-[#0f1419] text-[15px] leading-relaxed mb-3">
              {post?.content || 'No content available'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between max-w-md -ml-2">
              {/* Comment */}
              <button className="icon-btn text-[#536471] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10">
                <MessageCircle size={18} />
                <span className="text-sm">{post?.comments || 0}</span>
              </button>

              {/* Like */}
              <button 
                onClick={handleLike}
                className={`icon-btn ${
                  liked 
                    ? 'text-[#f91880]' 
                    : 'text-[#536471] hover:text-[#f91880] hover:bg-[#f91880]/10'
                }`}
              >
                <Heart 
                  size={18} 
                  fill={liked ? 'currentColor' : 'none'}
                />
                <span className="text-sm">{likesCount}</span>
              </button>

              {/* Share */}
              <button className="icon-btn text-[#536471] hover:text-[#00ba7c] hover:bg-[#00ba7c]/10">
                <Share2 size={18} />
                <span className="text-sm">{post?.shares || 0}</span>
              </button>

              {/* Bookmark */}
              <button 
                onClick={handleBookmark}
                className={`icon-btn ${
                  bookmarked 
                    ? 'text-[#1d9bf0]' 
                    : 'text-[#536471] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10'
                }`}
              >
                <Bookmark 
                  size={18} 
                  fill={bookmarked ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* More Options */}
        <button className="text-[#536471] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}