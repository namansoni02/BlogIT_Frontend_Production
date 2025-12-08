import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home, User, Users, PenSquare, LogOut, MoreHorizontal } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar-twitter">
      {/* Logo */}
      <div className="py-2 px-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
        >
          <img src={logo} alt="MonkNet" className="w-10 h-10" />
        </button>
      </div>

      {/* Navigation */}
      {user && (
        <nav className="flex flex-col gap-1 flex-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="nav-link-twitter nav-link-twitter-active"
          >
            <Home size={26} />
            <span className="hidden xl:inline">Home</span>
          </button>

          <button
            onClick={() => navigate("/users")}
            className="nav-link-twitter"
          >
            <Users size={26} />
            <span className="hidden xl:inline">Users</span>
          </button>

          <button
            onClick={() => navigate(`/profile/${user.username}`)}
            className="nav-link-twitter"
          >
            <User size={26} />
            <span className="hidden xl:inline">Profile</span>
          </button>

          {/* Post Button */}
          <button
            onClick={() => navigate("/create-post")}
            className="btn-twitter w-full mt-4 hidden xl:flex"
          >
            Post
          </button>

          <button
            onClick={() => navigate("/create-post")}
            className="icon-btn w-12 h-12 xl:hidden mt-4 bg-black hover:bg-gray-800"
          >
            <PenSquare size={24} className="text-white" />
          </button>
        </nav>
      )}

      {/* User Profile */}
      {user && (
        <div className="mt-auto mb-4 relative group">
          <button className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 w-full transition-colors">
            <div className="avatar-twitter">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden xl:block flex-1 text-left">
              <p className="text-sm font-bold text-primary">{user.username}</p>
              <p className="text-sm text-secondary">@{user.username}</p>
            </div>
            <MoreHorizontal size={18} className="hidden xl:block text-primary" />
          </button>

          {/* Dropdown */}
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden border border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-bold text-primary hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} />
              Log out @{user.username}
            </button>
          </div>
        </div>
      )}

      {!user && (
        <button
          onClick={() => navigate("/login")}
          className="btn-twitter w-full mb-4"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
