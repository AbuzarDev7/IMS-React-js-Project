import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { auth, db } from "../../config/firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const navigate = useNavigate();

  // Get logged-in admin email
  useEffect(() => {
    const fetchAdminEmail = () => {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        setAdminEmail(email);
        localStorage.setItem("adminEmail", email);
      } else {
        navigate("/login");
      }
    };
    fetchAdminEmail();
  }, [navigate]);

  // Fetch admin name from Firestore
  useEffect(() => {
    if (!adminEmail) return;
    const q = query(collection(db, "users"), where("email", "==", adminEmail));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setAdminName(snapshot.docs[0].data().name || "Admin");
      } else {
        setAdminName("Admin");
      }
    });
    return () => unsub();
  }, [adminEmail]);

  //  Realtime students count
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTotalStudents(snapshot.size);
    });
    return () => unsub();
  }, []);

  // Realtime courses count
  useEffect(() => {
    const q = query(collection(db, "courses"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTotalCourses(snapshot.size);
    });
    return () => unsub();
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
