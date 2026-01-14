import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

function AssignCourse() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  // Component load hone pe students aur courses fetch karo
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // ============================================
  // STEP 1: Students ko Firebase se fetch karo
  // ============================================
  const fetchStudents = async () => {
    try {
      // Sirf students ko fetch karo (role = "student")
      const q = query(
        collection(db, 'users'), 
        where('role', '==', 'student')
      );
      
      const snapshot = await getDocs(q);
      
      const studentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email
      }));
      
      setStudents(studentsList);
      console.log("Students fetched:", studentsList);
      
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ============================================
  // STEP 2: Courses ko Firebase se fetch karo
  // ============================================
  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      
      const coursesList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        duration: doc.data().duration
      }));
      
      setCourses(coursesList);
      console.log("Courses fetched:", coursesList);
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // ============================================
  // STEP 3: Course assign karo (MAIN FUNCTION)
  // ============================================
  const handleAssign = async () => {
    // Validation: Check karo ke dono select kiye hain
    if (!selectedStudent || !selectedCourse) {
      alert('Please select both student and course!');
      return;
    }

    setLoading(true);

    try {
      // Firebase mein 'enrollments' collection mein save karo
      const enrollmentData = {
        studentId: selectedStudent,
        courseId: selectedCourse,
        assignedAt: new Date(),
        status: 'active'
      };

      await addDoc(collection(db, 'enrollments'), enrollmentData);
      
      alert('Course assigned successfully! ✅');
      
      // Form reset karo
      setSelectedStudent('');
      setSelectedCourse('');
      
    } catch (error) {
      console.error('Error assigning course:', error);
      alert('Failed to assign course! ❌');
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Assign Course to Student</h2>

      {/* Student Select Dropdown */}
      <div>
        <label>Select Student:</label>
        <select 
          value={selectedStudent} 
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Choose Student --</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>
      </div>

      {/* Course Select Dropdown */}
      <div>
        <label>Select Course:</label>
        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Choose Course --</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.duration})
            </option>
          ))}
        </select>
      </div>

      {/* Assign Button */}
      <button onClick={handleAssign} disabled={loading}>
        {loading ? 'Assigning...' : 'Assign Course'}
      </button>
    </div>
  );
}

export default AssignCourse;