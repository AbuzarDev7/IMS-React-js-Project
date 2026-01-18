
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth , db } from "../../config/firebase/firebase";

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
        console.log(" Fetching courses for:", email);

        //  Get Student Name from users collection
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnap = await getDocs(userQuery);

        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          setStudentName(userData.name);
          console.log(" Student Name:", userData.name);
        }

        //  Get enrollments by studentEmail
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
        // console.log(" Course Names:", courseNames);

        // Fetch full course details from courses collection
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
        const validCourses = coursesList.filter(c => c !== null);

        // console.log(" Courses loaded:", validCourses);


        setCourses(validCourses);

      } catch (err) {
        // console.error(" Error fetching courses:", err);
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
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 rounded-xl border-2 border-red-300">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Courses</h1>
              <p className="text-blue-100 text-lg">
                Welcome back, {studentName || userEmail}!
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-4 border border-white border-opacity-30">
              <p className="text-sm font-semibold mb-1">Total Enrolled</p>
              <p className="text-4xl font-bold">{courses.length}</p>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Courses Yet</h2>
            <p className="text-gray-500 text-lg">
              You haven't been assigned any courses yet. Contact your admin to get enrolled!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <div
                key={course.id || index}
                className="group bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                      Course {index + 1}
                    </span>
                    <span className="text-2xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-tight">
                    {course.courseName || "Unnamed Course"}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {course.description && (
                    <div className="mb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  )}

                  {course.duration && (
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                      <span className="text-2xl mr-3">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                        <p className="text-lg font-bold text-blue-600">{course.duration}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full">
                      <span className="mr-2">✓</span>
                      <span className="font-bold text-sm">ENROLLED</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Section */}
        {courses.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Course Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Student</p>
                <p className="text-lg font-bold text-purple-600 truncate">
                  {studentName || "Student"}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyCourses;