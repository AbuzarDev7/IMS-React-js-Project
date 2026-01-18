// src/components/Sidebar.jsx
import React from "react";
import { signOut } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../config/firebase/firebase";
import { FaHome, FaUserGraduate, FaBook, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Students", path: "/students", icon: <FaUserGraduate /> },
    { name: "Courses", path: "/courses", icon: <FaBook /> },
  ];

  const logout = () => {
    signOut(auth)
      .then(() => (window.location.href = "/login"))
      .catch(() => alert("Logout failed"));
  };

  return (
    <div className=" h-screen w-64  bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between shadow-xl">
      {/* Logo */}
      <div className="text-center py-6 border-b border-gray-700">
        <h1 className="text-3xl font-extrabold tracking-wide text-indigo-400">IMS</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6 flex flex-col gap-3 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200
              ${
                location.pathname === item.path
                  ? "bg-gray-700 font-semibold shadow-inner"
                  : "hover:bg-gray-700 hover:shadow-md"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-md">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 bg-red-600 mx-4 mb-6 py-3 rounded-lg hover:bg-red-700 hover:shadow-md transition-all font-semibold"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
