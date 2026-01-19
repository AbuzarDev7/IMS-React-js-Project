import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase/firebase";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserGraduate, FaBook, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    signOut(auth)
      .then(() => (window.location.href = "/login"))
      .catch(() => alert("Logout failed"));
  };

  const linkClass = (path) =>
    `flex items-center gap-3 py-2 px-3 rounded transition
     ${
       location.pathname === path
         ? "bg-gray-700 font-semibold"
         : "hover:bg-gray-700"
     }`;

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        {/* Logo & Close Button */}
        <div className="text-center py-6 border-b border-gray-700 relative">
          <h1 className="text-2xl font-bold tracking-wide">IMS</h1>
          
          {/* Close Button - Mobile Only (inside sidebar, left side) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute left-4 top-6 text-white hover:text-gray-300 transition"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-6 flex flex-col gap-2 px-4">
          <Link
            to="/"
            className={linkClass("/")}
            onClick={() => setIsOpen(false)}
          >
            <FaHome />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/students"
            className={linkClass("/students")}
            onClick={() => setIsOpen(false)}
          >
            <FaUserGraduate />
            <span>Students</span>
          </Link>

          <Link
            to="/courses"
            className={linkClass("/courses")}
            onClick={() => setIsOpen(false)}
          >
            <FaBook />
            <span>Courses</span>
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="mx-4 mb-6 flex items-center justify-center gap-2 bg-red-600 py-2 rounded hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
