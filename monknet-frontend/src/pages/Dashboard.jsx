import Navbar from "../components/common/Navbar";
import { useContext , useState ,useEffect, useRef, use } from "react";
import { AuthContext } from "../context/AuthContext";
import getPostsService from "../services/getPostsService";
import UserDetailsFetching from "../services/UserDetailsFetchingService";
import PostBox from "../components/post/postBox";
import FactBox from "../components/common/FactBox";
import ExtinctAnimalFact from "../components/common/ExtinctAnimalFact";
import ProfileFactBox from "../components/common/ProfileFactBox";
import { ChevronDown, LogOut, MoreHorizontal, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const feedRef = useRef(null);

  // Fetch user data on mount to get profileImage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check sessionStorage
        const cachedUserData = sessionStorage.getItem("userData");
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          setUserProfile(parsedData);
          console.log("User data from sessionStorage:", parsedData);
          console.log("User profile image from sessionStorage:", parsedData.profileImage);
        }
        
        // Then fetch fresh data
        const userData = await UserDetailsFetching();
        if (userData) {
          setUserProfile(userData);
          console.log("Fresh user data fetched:", userData);
          console.log("User profile image:", userData.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to user from AuthContext if fetch fails
        if (user) {
          setUserProfile(user);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch posts when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setHasScrolledToEnd(false);
      try {
        console.log("Fetching posts for page:", page);
        const fetchedPosts = await getPostsService(page);
        console.log("Received posts:", fetchedPosts);
        
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts((prevPosts) => {
            // Combine previous posts with newly fetched posts
            const allPosts = [...prevPosts, ...fetchedPosts];
            
            // Remove duplicates based on post ID
            const uniquePosts = allPosts.filter((post, index, self) => 
              index === self.findIndex((p) => (p._id || p.id) === (post._id || post.id))
            );
            
            console.log("Updated posts state:", uniquePosts);
            return uniquePosts;
          });
        } else {
          console.log("No posts fetched");
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Detect when user scrolls to the end of posts
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const feedElement = feedRef.current;
      const scrollPosition = feedElement.scrollTop + feedElement.clientHeight;
      const scrollHeight = feedElement.scrollHeight;
      
      // Check if scrolled to bottom (with 50px threshold)
      if (scrollPosition >= scrollHeight - 50 && !loading) {
        setHasScrolledToEnd(true);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      return () => feedElement.removeEventListener('scroll', handleScroll);
    }
  }, [loading]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Handle post deletion
  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };
  var profilePic;
  useEffect(() => {
    profilePic = localStorage.getItem("userProfilePicture");
    //console.log("Rendering Dashboard - Profile Picture URL:", profilePic);
  }, [userProfile, user]);
  
  return (
    <div className="container-twitter">
      <Navbar />
      
      {/* Center Feed */}
      <div className="feed-twitter">
        {/* Feed Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#eff3f4]">
          <div className="px-4 py-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0f1419] px-6">Home</h2>
            
            {/* User Profile - Top Right */}
            {(userProfile || user) && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  {(profilePic) ? (
                    <img 
                      src={profilePic }
                      alt={(userProfile?.username || user?.username)}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        console.log("Image failed to load, hiding element");
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!(userProfile?.profileImage || user?.profileImage) && (
                    <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white text-sm font-bold">
                      {(userProfile?.username || user?.username)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-bold text-[#0f1419] hidden sm:inline">{userProfile?.username || user?.username}</span>
                  <MoreHorizontal size={16} className="text-[#536471]" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden border border-[#eff3f4]">
                  <button
                    onClick={() => navigate(`/profile/${userProfile?.username || user?.username}`)}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-[#0f1419] hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-[#0f1419] hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts Feed */}
        <div ref={feedRef} className="overflow-y-auto">
          {/* Loading indicator */}
          {loading && posts.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1d9bf0] border-t-transparent"></div>
            </div>
          )}

          {/* Posts display */}
          {posts.length > 0 ? (
            posts.map((post) => {
              if (typeof post === 'string') {
                console.warn("Skipping invalid post (ID only):", post);
                return null;
              }
              return <PostBox key={post._id || post.id} post={post} onDelete={handleDeletePost} />;
            })
          ) : (
            !loading && (
              <div className="text-center py-12 px-4">
                <p className="text-[#536471] text-lg">No posts available yet.</p>
                <p className="text-[#536471] text-sm mt-2">Be the first to create a post!</p>
              </div>
            )
          )}

          {/* Load More Button - Always visible at bottom when there are posts */}
          {!loading && posts.length > 0 && (
            <div className="flex justify-center py-6 border-t border-[#eff3f4]">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-1 px-3 py-1.5 text-black border-2 border-black hover:bg-gray-100 rounded transition-colors text-sm"
              >
                <ChevronDown size={16} />
                <span>Load More</span>
              </button>
            </div>
          )}

          {/* Loading more indicator */}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-4 border-t border-[#eff3f4]">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#1d9bf0] border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Widgets */}
      <div className="widgets-twitter">
        {/* Useless Fact */}
        <ProfileFactBox />

        {/* Random Fact */}
        <FactBox />

        {/* Extinct Animal */}
        <ExtinctAnimalFact />
      </div>
    </div>
  );
}
