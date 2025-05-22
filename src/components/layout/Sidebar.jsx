import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaCog,
  FaBriefcase,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Xizmatlar", path: "/services", icon: <FaCog /> },
    { name: "Portfolio", path: "/portfolio", icon: <FaBriefcase /> },
    { name: "Biz Haqimizda", path: "/about", icon: <FaInfoCircle /> },
    { name: "Kontaktlar", path: "/contacts", icon: <FaPhoneAlt /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition-transform transform bg-white border-r dark:bg-slate-800 dark:border-slate-700 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              Admin Panel
            </h1>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <span className="mr-3 text-lg text-red-500">
                <FaSignOutAlt />
              </span>
              Chiqish
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
