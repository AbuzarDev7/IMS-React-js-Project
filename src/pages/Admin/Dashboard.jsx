import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { auth, db } from "../../config/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const navigate = useNavigate();

  // ✅ Get logged-in admin email from Firebase Auth
  useEffect(() => {
    const fetchAdminEmail = async () => {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        setAdminEmail(email);
        localStorage.setItem("adminEmail", email);
      } else {
        // Agar login nahi hai to redirect to login
        navigate("/login");
      }
    };

    fetchAdminEmail();
  }, [navigate]);

  // ✅ Fetch admin name from Firestore `users` collection
  useEffect(() => {
    const fetchAdminName = async () => {
      if (!adminEmail) return;

      try {
        const q = query(collection(db, "users"), where("email", "==", adminEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const adminData = snap.docs[0].data();
          setAdminName(adminData.name || "");
        } else {
          setAdminName("Admin"); // Fallback
        }
      } catch (error) {
        console.error("Error fetching admin name:", error);
        setAdminName("Admin");
      }
    };

    fetchAdminName();
  }, [adminEmail]);

  // ✅ Count students (replace with Firestore if needed)
  useEffect(() => {
    const fetchStudents = async () => {
      // Replace this static data with Firestore fetch if required
      const users = [
        { role: "admin" },
        { role: "student" },
        { role: "student" },
        { role: "student" },
      ];
      const students = users.filter((user) => user.role === "student");
      setTotalStudents(students.length);
    };

    fetchStudents();
  }, []);

  // ✅ Count courses (replace with Firestore if needed)
  useEffect(() => {
    const fetchCourses = async () => {
      const courses = [1, 2, 3, 4, 5];
      setTotalCourses(courses.length);
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-1 md:ml-64 p-6 pt-24 md:pt-6 overflow-y-auto">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-500 font-semibold mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-green-600">{totalStudents}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-500 font-semibold mb-2">Total Courses</h3>
            <p className="text-4xl font-bold text-blue-600">{totalCourses}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-gray-500 font-semibold mb-2">Logged Admin</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {adminName || "Loading..."}
            </p>
            <p className="text-sm text-gray-500 mt-1">{adminEmail}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/students/add")}
            className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition shadow-md"
          >
            ➕ Add Student
          </button>

          <button
            onClick={() => navigate("/courses/add")}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md"
          >
            📚 Add Course
          </button>

          <button
            onClick={() => navigate("/assign-course")}
            className="bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-md"
          >
            🎯 Assign Course
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
