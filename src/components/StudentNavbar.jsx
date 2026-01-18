import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase/firebase";
import { FaBookOpen, FaUserGraduate, FaSignOutAlt } from "react-icons/fa";

const StudentNavbar = () => {
  const [show, setShow] = useState(false);
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
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <FaUserGraduate className="text-2xl" />
          Student Panel
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-gray-700 font-medium">
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

          {/* Logout as NavLink */}
          <NavLink
            to="/login"
            onClick={handleLogout} // Firebase signOut + navigate
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
