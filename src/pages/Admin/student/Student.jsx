
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from '../../../components/Navbar'
import { db } from "../../../config/firebase/firebase";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      // 1 Get all users
      const usersSnap = await getDocs(collection(db, "users"));
      const studentsList = usersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === "student");

      //  Get enrollments
      const enrollSnap = await getDocs(collection(db, "enrollments"));
      const enrollments = enrollSnap.docs.map(doc => doc.data());

      //  Attach courses
      const finalStudents = studentsList.map(student => {
        const myCourses = enrollments
          .filter(e => e.studentId === student.id)
          .map(e => e.courseName);
        return {
          ...student,
          enrolledCourses: myCourses,
        };
      });

      setStudents(finalStudents);
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Students</h2>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 flex flex-col items-center"
            >
              {/* Profile placeholder */}
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 text-2xl font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">
                {student.name}
              </h3>
              <p className="text-gray-500 text-center mb-2">{student.email}</p>

              <div className="mt-2 text-center">
                <h4 className="text-gray-600 font-medium mb-1">Enrolled Courses</h4>
                {student.enrolledCourses.length > 0 ? (
                  <ul className="text-gray-700 text-sm">
                    {student.enrolledCourses.map((course, index) => (
                      <li key={index}>• {course}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No courses assigned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
