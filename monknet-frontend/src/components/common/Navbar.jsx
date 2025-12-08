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
          className="w-20 h-20 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
        >
          <img src={logo} alt="MonkNet" className="w-30 h-30 select-none pointer-events-none" />
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
            className="icon-btn w-12 h-12 xl:hidden mt-4 bg-black hover:bg-gray-800 rounded-lg"
          >
            <PenSquare size={24} className="text-white" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 mx-3 mt-auto mb-4 text-black border-2 border-black hover:bg-gray-100 rounded transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </nav>
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
