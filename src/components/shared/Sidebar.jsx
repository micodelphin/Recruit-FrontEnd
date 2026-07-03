// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContex";
import {
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaCog,
} from "react-icons/fa";

const Sidebar = ({ links = [] }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  return (
    <aside
      className={`h-screen fixed left-0 top-0 z-40 flex flex-col
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
        text-white shadow-2xl border-r border-slate-700/50
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/60">
        <div className={`flex items-center gap-3 ${collapsed && "justify-center w-full"}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-900/30">
            R
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold leading-tight whitespace-nowrap">
                Recruitment
              </h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                {user?.role?.replace("_", " ") || "System"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (floating) */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-xs shadow-md transition"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
      </button>

      {/* User card */}
      <div className={`p-4 border-b border-slate-700/60 ${collapsed && "px-2"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-sm shadow-md">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>
        )}

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            title={collapsed ? link.label : ""}
            className={({ isActive }) =>
              `group relative flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r" />
                )}
                <span className="text-lg shrink-0">{link.icon}</span>
                {!collapsed && <span className="truncate">{link.label}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-800 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg z-50">
                    {link.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-slate-700/60 space-y-1">
        <NavLink
          to="/notifications"
          title={collapsed ? "Notifications" : ""}
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition`}
        >
          <FaBell />
          {!collapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink
          to="/settings"
          title={collapsed ? "Settings" : ""}
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition`}
        >
          <FaCog />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : ""}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition`}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;