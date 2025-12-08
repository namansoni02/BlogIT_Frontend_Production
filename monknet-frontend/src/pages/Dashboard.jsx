import Navbar from "../components/common/Navbar";
import { useContext , useState ,useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import UserDetailsFetching from "../services/UserDetailsFetchingService";
import UserStatsBox from "@/components/post/userStatsBox";
import getPostsService from "../services/getPostsService";
import PostBox from "../components/post/postBox";
import { ChevronDown } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setdata] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const feedRef = useRef(null);

  // Fetch user details
  useEffect(() => {
    UserDetailsFetching().then(setdata);
  }, []);

  // Fetch posts when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setHasScrolledToEnd(false);
      try {
        const fetchedPosts = await getPostsService(page);
        
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts((prevPosts) => {
            // Combine previous posts with newly fetched posts
            const allPosts = [...prevPosts, ...fetchedPosts];
            
            // Remove duplicates based on post ID
            const uniquePosts = allPosts.filter((post, index, self) => 
              index === self.findIndex((p) => (p._id || p.id) === (post._id || post.id))
            );
            
            return uniquePosts;
          });
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Profile Card */}
          <div className="hidden lg:block lg:col-span-3">
                 {data && <UserStatsBox data={data}/>}
          </div>

          {/* Center - Feed with Scrolling */}
          <div className="col-span-1 lg:col-span-6">
            <div 
              ref={feedRef}
              className="h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 pr-2"
            >
              <div className="space-y-4">
                {/* Loading indicator */}
                {loading && posts.length === 0 && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                )}

                {/* Posts display */}
                {posts.length > 0 ? (
                  posts.map((post) => {
                    // Skip if post is just an ID string instead of an object
                    if (typeof post === 'string') {
                      console.warn("Skipping invalid post (ID only):", post);
                      return null;
                    }
                    return <PostBox key={post._id || post.id} post={post} />;
                  })
                ) : (
                  !loading && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                      <p className="text-gray-500 text-lg">No posts available yet.</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to create a post!</p>
                    </div>
                  )
                )}

                {/* Load More Button - Shows when scrolled to end */}
                {hasScrolledToEnd && !loading && posts.length > 0 && (
                  <div className="flex justify-center py-6">
                    <button
                      onClick={handleLoadMore}
                      className="flex flex-col items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover-lift"
                    >
                      <span className="font-medium">Load More Posts</span>
                      <ChevronDown size={24} className="animate-bounce" />
                    </button>
                  </div>
                )}

                {/* Loading more indicator */}
                {loading && posts.length > 0 && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Suggestions */}
          <div className="hidden lg:block lg:col-span-3">
            
          </div>

        </div>
      </div>
    </div>
  );
}
