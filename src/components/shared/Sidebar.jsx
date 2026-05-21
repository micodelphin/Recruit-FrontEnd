import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContex";
import {
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ links }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-indigo-900 text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-xl font-bold">Recruitment System</h1>
        <p className="text-indigo-300 text-sm mt-1">{user?.role?.replace("_", " ")}</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-indigo-300 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition text-sm ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-200 hover:bg-indigo-700"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-700 transition w-full text-sm"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;