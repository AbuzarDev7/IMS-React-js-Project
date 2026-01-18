// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../../components/Navbar";
import { auth, db } from "../../config/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [adminName, setAdminName] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const navigate = useNavigate();

  // 🔹 Fetch admin name - SIRF ADMIN ROLE WALA
  useEffect(() => {
    const fetchAdminName = async () => {
      if (!auth.currentUser) return;
      
      const snapshot = await getDocs(collection(db, "users"));
      const admin = snapshot.docs.find(
        (doc) => 
          doc.data().email === auth.currentUser.email && 
          doc.data().role === "admin" // ✅ ROLE CHECK
      );
      
      if (admin) {
        setAdminName(admin.data().name);
      }
    };
    
    fetchAdminName();
  }, []);

  // 🔹 Fetch students count
  useEffect(() => {
    const fetchStudentsCount = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const students = snapshot.docs.filter(
        (doc) => doc.data().role === "student"
      );
      setTotalStudents(students.length);
    };
    fetchStudentsCount();
  }, []);

  // 🔹 Fetch courses count
  useEffect(() => {
    const fetchCoursesCount = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      setTotalCourses(snapshot.docs.length);
    };
    fetchCoursesCount();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* 🔹 Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-gray-500">Total Students</h3>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>

          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-gray-500">Total Courses</h3>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </div>

          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-gray-500">Logged Admin</h3>
            <p className="text-2xl font-bold">{adminName || "Loading..."}</p>
          </div>
        </div>

        {/* 🔹 Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/students/add")}
            className="bg-green-500 text-white py-3 rounded hover:bg-green-600"
          >
            Add Student
          </button>

          <button
            onClick={() => navigate("/courses/add")}
            className="bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Course
          </button>

          <button
            onClick={() => navigate("/assign-course")}
            className="bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600"
          >
            Assign Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;