import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export default function AssignCourse() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const studentList = snapshot.docs
      .map(doc => {
        const data = doc.data();
        if (data.role?.toLowerCase() === 'student') {
          return { uid: doc.id, name: data.name, email: data.email };
        }
        return null;
      })
      .filter(Boolean);
    setStudents(studentList);
  };

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, 'courses'));
    const coursesList = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    setCourses(coursesList);
  };

  const handleAssign = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert("Please select both student and course!");
      return;
    }
    setLoading(true);

    try {
      // ✅ Save enrollment with student UID
      await addDoc(collection(db, 'enrollments'), {
        studentId: selectedStudent,  // Auth UID
        courseId: selectedCourse,
        assignedAt: new Date().toISOString()
      });

      alert("Course assigned successfully!");
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (err) {
      console.error("Error assigning course:", err);
      alert("Failed to assign course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-center text-2xl font-semibold mb-6">Assign Course to Student</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Select Student</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map(s => (
            <option key={s.uid} value={s.uid}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Course</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button
        className={`w-full py-3 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        onClick={handleAssign}
        disabled={loading}
      >
        {loading ? 'Assigning...' : 'Assign Course'}
      </button>
    </div>
  );
}
