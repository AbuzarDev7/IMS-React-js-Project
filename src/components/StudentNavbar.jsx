import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase/firebase";
import { FaBookOpen, FaUserGraduate, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const StudentNavbar = () => {
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setShow(!!user);
    });
    return () => unsub();
  }, []);

  if (!show) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
    setMenuOpen(false); // close menu on logout
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <FaUserGraduate className="text-2xl" />
          Student Panel
        </div>

        {/* Hamburger Button - Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink
            to="/my-courses"
            className={({ isActive }) =>
              `flex items-center gap-1 transition ${
                isActive ? "text-indigo-600" : "hover:text-indigo-500"
              }`
            }
          >
            <FaBookOpen />
            Courses
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-1 transition ${
                isActive ? "text-indigo-600" : "hover:text-indigo-500"
              }`
            }
          >
            <FaUserGraduate />
            Profile
          </NavLink>

          <NavLink
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md w-full px-6 pb-4 flex flex-col gap-4">
          <NavLink
            to="/my-courses"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
                isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-500"
              }`
            }
          >
            <FaBookOpen />
            Courses
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
                isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-500"
              }`
            }
          >
            <FaUserGraduate />
            Profile
          </NavLink>

          <NavLink
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
