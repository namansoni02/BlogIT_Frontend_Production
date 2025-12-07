import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-300 px-5 shadow-md">
      <div className="flex-1">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
          MonkNet 🧘‍♂️
        </h1>
      </div>
      
      <div className="flex-none">
        <button className="btn btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
