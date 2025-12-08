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
    <div className="container-twitter">
      <Navbar />
      
      {/* Center Feed */}
      <div className="feed-twitter">
        {/* Feed Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#eff3f4]">
          <div className="px-4 py-3">
            <h2 className="text-xl font-bold text-[#0f1419]">Home</h2>
          </div>
          
          {/* Feed Tabs */}
          <div className="flex border-b border-[#eff3f4]">
            <button className="tab-twitter active flex-1 py-4 font-semibold text-[#0f1419]">
              For you
            </button>
            <button className="tab-twitter flex-1 py-4 font-semibold text-[#536471] hover:bg-gray-50">
              Following
            </button>
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
              return <PostBox key={post._id || post.id} post={post} />;
            })
          ) : (
            !loading && (
              <div className="text-center py-12 px-4">
                <p className="text-[#536471] text-lg">No posts available yet.</p>
                <p className="text-[#536471] text-sm mt-2">Be the first to create a post!</p>
              </div>
            )
          )}

          {/* Load More Button */}
          {hasScrolledToEnd && !loading && posts.length > 0 && (
            <div className="flex justify-center py-6 border-t border-[#eff3f4]">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 px-6 py-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors font-semibold"
              >
                <span>Load More Posts</span>
                <ChevronDown size={20} />
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
        {/* What's happening */}
        <div className="card-twitter mb-4">
          <h2 className="text-xl font-bold text-[#0f1419] p-4 pb-3">What's happening</h2>
          
          <div className="hover:bg-gray-50 transition-colors cursor-pointer p-4 border-b border-[#eff3f4]">
            <div className="text-xs text-[#536471] mb-1">Trending in Technology</div>
            <div className="font-semibold text-[#0f1419]">#BlogIT</div>
            <div className="text-xs text-[#536471] mt-1">2,847 posts</div>
          </div>

          <div className="hover:bg-gray-50 transition-colors cursor-pointer p-4 border-b border-[#eff3f4]">
            <div className="text-xs text-[#536471] mb-1">Trending in Coding</div>
            <div className="font-semibold text-[#0f1419]">#WebDev</div>
            <div className="text-xs text-[#536471] mt-1">5,234 posts</div>
          </div>

          <div className="hover:bg-gray-50 transition-colors cursor-pointer p-4">
            <div className="text-[#1d9bf0] text-sm hover:underline">Show more</div>
          </div>
        </div>

        {/* User Stats */}
        {data && <UserStatsBox data={data}/>}
      </div>
    </div>
  );
}
