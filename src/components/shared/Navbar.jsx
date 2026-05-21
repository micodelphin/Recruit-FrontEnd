import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-indigo-600">
        Recruitment System
      </h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.firstName?.charAt(0)}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition text-sm"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;