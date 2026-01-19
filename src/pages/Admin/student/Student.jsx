import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";
import Navbar from "../../../components/Navbar";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const studentsList = usersSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "student");

      const enrollSnap = await getDocs(collection(db, "enrollments"));
      const enrollments = enrollSnap.docs.map((doc) => doc.data());

      const finalStudents = studentsList.map((student) => {
        const myCourses = enrollments
          .filter((e) => e.studentId === student.id)
          .map((e) => e.courseName);
        return { ...student, enrolledCourses: myCourses };
      });

      setStudents(finalStudents);
    };

    fetchStudents();
  }, []);

  return (
    <>
      {/* Sidebar */}
      <Navbar />

      {/* Main content - Mobile pe full width, Desktop pe sidebar ke baad */}
      <main className="min-h-screen bg-gray-100 md:ml-64">
        <div className="p-6 pt-20 md:pt-6">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            All Students
          </h2>

          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-[380px]"
              >
                {/* Top Section - Profile */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 text-3xl font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {student.name}
                  </h3>
                  <p className="text-gray-500 text-sm text-center break-all px-2 mb-4">
                    {student.email}
                  </p>
                </div>
                
                {/* Bottom Section - Enrolled Courses */}
                <div className="flex-1 flex flex-col justify-end w-full pt-4 border-t border-gray-200">
                  <h4 className="text-gray-600 font-medium mb-3 text-center">
                    Enrolled Courses
                  </h4>
                  <div className="overflow-y-auto max-h-[120px]">
                    {student.enrolledCourses.length > 0 ? (
                      <ul className="text-gray-700 text-sm space-y-1.5">
                        {student.enrolledCourses.map((course, index) => (
                          <li key={index} className="text-center">
                            • {course}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm text-center italic">
                        No courses assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Students;