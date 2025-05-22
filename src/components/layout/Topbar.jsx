import React from "react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";

const Topbar = ({ darkMode, toggleDarkMode, setIsMobileMenuOpen }) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-md dark:bg-slate-800 dark:text-white">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-700 rounded-md lg:hidden dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            aria-label="Open mobile menu"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Right side actions */}
          <div className="flex items-center ml-auto">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 rounded-full dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
