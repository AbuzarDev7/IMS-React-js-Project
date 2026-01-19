import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth , db } from "../../config/firebase/firebase";
import StudentNavbar from "../../components/StudentNavbar";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [studentName, setStudentName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError("Please log in to view your courses");
        return;
      }

      try {
        const email = user.email;
        setUserEmail(email);

        // Get Student Name from users collection
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          setStudentName(userData.name);
        }

        // Get enrollments by studentEmail
        const enrollQuery = query(
          collection(db, "enrollments"),
          where("studentEmail", "==", email)
        );
        const enrollSnap = await getDocs(enrollQuery);
        if (enrollSnap.empty) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Get course names from enrollments
        const courseNames = enrollSnap.docs.map(doc => doc.data().courseName);

        // Fetch full course details
        const coursesPromises = courseNames.map(async (courseName) => {
          const courseQuery = query(
            collection(db, "courses"),
            where("courseName", "==", courseName)
          );
          const courseSnap = await getDocs(courseQuery);
          if (!courseSnap.empty) {
            return {
              id: courseSnap.docs[0].id,
              ...courseSnap.docs[0].data()
            };
          }
          return null;
        });

        const coursesList = await Promise.all(coursesPromises);
        setCourses(coursesList.filter(c => c !== null));

      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 bg-red-50 rounded-xl border-2 border-red-300">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-6">
      <StudentNavbar />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transform transition-transform duration-500 hover:scale-[1.01]">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-white tracking-wide">My Courses</h1>
            <p className="text-white text-lg opacity-90">
              Welcome back, {studentName || userEmail}!
            </p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl px-6 py-4 border border-white border-opacity-30 text-center shadow-lg">
            <p className="text-sm font-semibold mb-1">Total Enrolled</p>
            <p className="text-4xl font-extrabold">{courses.length}</p>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-200 hover:shadow-xl transition-all">
            <div className="text-6xl mb-4 animate-bounce">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Courses Yet</h2>
            <p className="text-gray-500 text-lg">
              You haven't been assigned any courses yet. Contact your admin to get enrolled!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <div
                key={course.id || index}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden hover:scale-[1.03]"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
                      Course {index + 1}
                    </span>
                    <span className="text-2xl animate-pulse">📖</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-tight">{course.courseName || "Unnamed Course"}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {course.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">{course.description}</p>
                  )}

                  {course.duration && (
                    <div className="flex items-center bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4">
                      <span className="text-2xl mr-3">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                        <p className="text-lg font-bold text-indigo-600">{course.duration}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 flex justify-center">
                    <div className="flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold shadow-md">
                      <span className="mr-2">✓</span>
                      <span>ENROLLED</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {courses.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Course Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 transform transition hover:scale-[1.02]">
                <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-indigo-600">{courses.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 transform transition hover:scale-[1.02]">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 transform transition hover:scale-[1.02] truncate">
                <p className="text-sm text-gray-600 mb-1">Student</p>
                <p className="text-lg font-bold text-purple-600 truncate">{studentName || "Student"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
