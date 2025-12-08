/**
 * UsersPage.jsx
 * --------------
 * Displays all users on the platform with follow/unfollow functionality
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import FactBox from "../components/common/FactBox";
import ExtinctAnimalFact from "../components/common/ExtinctAnimalFact";
import ProfileFactBox from "../components/common/ProfileFactBox";
import { getAllUsers } from "../services/UsersService";
import { followUser, unfollowUser } from "../services/FollowService";
import { AuthContext } from "../context/AuthContext";
import { Users as UsersIcon, Search } from "lucide-react";

export default function UsersPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        
        if (!data || data.length === 0) {
          console.log("No users found");
          setUsers([]);
          setFilteredUsers([]);
          return;
        }
        
        // Filter out current user
        const otherUsers = data.filter(u => u.username !== currentUser?.username);
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);
        
        // Initialize following map
        const following = {};
        otherUsers.forEach(u => {
          // Check if current user is following this user
          // This is a simplified check - you may need to fetch this from backend
          following[u._id] = u.followers?.includes(currentUser?.userId) || false;
        });
        setFollowingMap(following);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleFollowToggle = async (userId) => {
    try {
      if (followingMap[userId]) {
        await unfollowUser(userId);
        setFollowingMap(prev => ({ ...prev, [userId]: false }));
        
        // Update follower count in the users list
        setUsers(prev => prev.map(u => 
          u._id === userId 
            ? { ...u, followers: u.followers.filter(id => id !== currentUser?.userId) }
            : u
        ));
      } else {
        await followUser(userId);
        setFollowingMap(prev => ({ ...prev, [userId]: true }));
        
        // Update follower count in the users list
        setUsers(prev => prev.map(u => 
          u._id === userId 
            ? { ...u, followers: [...(u.followers || []), currentUser?.userId] }
            : u
        ));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status");
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="container-twitter">
        <Navbar />
        <div className="feed-twitter">
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        </div>
        <div className="widgets-twitter">
          <ProfileFactBox />
          <FactBox />
          <ExtinctAnimalFact />
        </div>
      </div>
    );
  }

  return (
    <div className="container-twitter">
      <Navbar />
      
      <div className="feed-twitter">
        <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="bg-white border-2 border-black rounded p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <UsersIcon className="w-8 h-8 text-black" />
            <h1 className="text-3xl font-bold text-black">Discover Users</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
              placeholder="Search users by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white border-2 border-black rounded p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {searchQuery ? "No users found matching your search" : "No users to display"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 rounded border-2 border-gray-300 hover:border-black transition-all"
                >
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => handleUserClick(user.username)}
                  >
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black hover:text-gray-700 transition-colors">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {user.followers?.length || 0} followers
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.following?.length || 0} following
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(user._id);
                    }}
                    className={`px-6 py-2 rounded font-semibold transition-all ${
                      followingMap[user._id]
                        ? "bg-white border-2 border-black text-black hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {followingMap[user._id] ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
        </div>
      </div>

      {/* Right Sidebar - Widgets */}
      <div className="widgets-twitter">
        <ProfileFactBox />
        <FactBox />
        <ExtinctAnimalFact />
      </div>
    </div>
  );
}
