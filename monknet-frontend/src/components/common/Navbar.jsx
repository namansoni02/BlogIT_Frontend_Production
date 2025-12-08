import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Compass, PenSquare, Users } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-xl">🧘‍♂️</span>
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">MonkNet</span>
            </button>
          </div>

          {/* Center Navigation - Explore and Post options */}
          {user && (
            <div className="flex items-center gap-2">
              {/* Explore Button */}
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 font-medium"
              >
                <Compass size={20} />
                <span className="hidden sm:inline" >Explore</span>
              </button>

              {/* Users Button */}
              <button 
                onClick={() => navigate("/users")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 font-medium"
              >
                <Users size={20} />
                <span className="hidden sm:inline">Users</span>
              </button>

              {/* Post Button */}
              <button 
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200 font-medium"
              >
                <PenSquare size={20} />
                <span className="hidden sm:inline">Post</span>
              </button>
            </div>
          )}

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                <span className="text-sm font-medium text-slate-700">Welcome,</span>
                <span className="text-sm font-bold text-gradient">{user.username}</span>
              </div>
              
              {/* User Avatar with Dropdown Menu */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
                  {user.username.charAt(0).toUpperCase()}
                </button>
                
                <div className="absolute right-0 mt-2 w-48 glass-effect rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="py-2">
                    <button 
                      onClick={() => navigate(`/profile/${user.username}`)}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                      Settings
                    </button>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 gradient-primary text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
