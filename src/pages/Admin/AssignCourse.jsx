
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

const AssignCourse = () => {

  const [students, setStudents] = useState([]);      
  const [courses, setCourses] = useState([]);        
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");    
  const [isLoading, setIsLoading] = useState(false); 

  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        
       
        const allUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
      
        const studentList = allUsers.filter(user => user.role === "student");
        
        setStudents(studentList);
        console.log(" Loaded", studentList.length, "students");
      } catch (error) {
        console.error("Error loading students:", error);
        alert("Failed to load students");
      }
    };

    fetchStudents();
  }, []); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        
        const coursesCollection = collection(db, "courses");
        const snapshot = await getDocs(coursesCollection);
        
      
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCourses(courseList);
        console.log("Loaded", courseList.length, "courses");
      } catch (error) {
        console.error(" Error loading courses:", error);
        alert("Failed to load courses");
      }
    };

    fetchCourses();
  }, []); 
  const handleAssignCourse = async () => {
    
    if (!selectedStudent || !selectedCourse) {
      alert(" Please select both student and course");
      return;
    }

    setIsLoading(true);

    try {

      const student = students.find(s => s.id === selectedStudent);
      

      const course = courses.find(c => c.id === selectedCourse);

  


      const enrollmentQuery = query(
        collection(db, "enrollments"),
        where("studentEmail", "==", student.email),
        where("courseName", "==", course.courseName)
      );
      const existingEnrollments = await getDocs(enrollmentQuery);

      // If already enrolled, show alert and stop
      if (!existingEnrollments.empty) {
        alert(`ALREADY ENROLLED!\n\n${student.name} is already enrolled in "${course.courseName}".\n\nPlease select a different course.`);
        setIsLoading(false);
        return;
      }

      console.log("No duplicate found, proceeding with enrollment...");

      // Create enrollment document
      const enrollmentData = {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        courseId: course.id,
        courseName: course.courseName, 
        assignedAt: new Date()
      };

      // Save to Firestore
      await addDoc(collection(db, "enrollments"), enrollmentData);

      console.log("Course assigned successfully!");
      alert(` SUCCESS!\n\nCourse: "${course.courseName}"\nAssigned to: ${student.name}\nEmail: ${student.email}\n\nThe student can now see this course in their dashboard.`);
      
      // Reset form
      setSelectedStudent("");
      setSelectedCourse("");

    } catch (error) {
      console.error(" Error assigning course:", error);
      alert("Failed to assign course: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
         Assign Course to Student
      </h2>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Available:</strong> {students.length} Students | {courses.length} Courses
        </p>
      </div>

      {/* Student Selection Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Select Student *
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Choose a Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>
      </div>

      {/* Course Selection Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Select Course *
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Choose a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Button */}
      <button
        onClick={handleAssignCourse}
        disabled={isLoading || !selectedStudent || !selectedCourse}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        {isLoading ? "Assigning..." : "Assign Course"}
      </button>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-gray-700">
           <strong>Tip:</strong> Select a student and a course, then click "Assign Course" button.
        </p>
      </div>
    </div>
  );
};

export default AssignCourse;