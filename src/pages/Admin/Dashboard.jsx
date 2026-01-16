// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../../components/Navbar";


import { auth, db } from "../../config/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [adminName, setAdminName] = useState("Admin"); 
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("No user logged in");
        navigate("/login");
        return;
      }

      try {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          // check role
          if (userData.role && userData.role.toLowerCase() === "admin") {
            setAdminName(userData.name || "Admin");
          } else {
            console.log("User is not admin:", userData.role);
            setAdminName("Admin");
          }
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

 
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const studentList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.role && item.role.toLowerCase() === "student");
        setStudents(studentList);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const courseList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(courseList);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 mb-2">Total Students</h3>
            <p className="text-3xl font-bold">{students.length}</p>
          </div>

          <div className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 mb-2">Total Courses</h3>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>

          <div className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 mb-2">Logged Admin</h3>
            <p className="text-3xl font-bold">{adminName}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate("/students/add")}
            className="bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
          >
            Add Student
          </button>
          <button
            onClick={() => navigate("/courses/add")}
            className="bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Add Course
          </button>
          <button
            onClick={() => navigate("/assign-course")}
            className="bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
          >
            Assign Course
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded shadow p-4 mb-6 overflow-x-auto">
          <h3 className="text-lg font-bold mb-3">Latest Students</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Email</th>
                <th className="border-b p-2">Enrolled Courses</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{student.name}</td>
                  <td className="border-b p-2">{student.email}</td>
                  <td className="border-b p-2">
                    {student.enrolledCourses && student.enrolledCourses.length > 0
                      ? student.enrolledCourses.join(", ")
                      : "No courses assigned"}
                  </td>
                  <td className="border-b p-2">
                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <h3 className="text-lg font-bold mb-3">Latest Courses</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Duration</th>
                <th className="border-b p-2">Description</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{course.courseName}</td>
                  <td className="border-b p-2">{course.duration}</td>
                  <td className="border-b p-2">{course.description}</td>
                  <td className="border-b p-2">
                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
