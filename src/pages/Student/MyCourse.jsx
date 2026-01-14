import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';
import { useSelector } from 'react-redux';

function MyCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Redux se logged-in student ki ID lena
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      // Step 1: Student ki enrollments find karo
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', user.id)
      );
      
      const enrollmentSnapshot = await getDocs(enrollmentsQuery);
      
      // Step 2: Har enrollment se courseId nikalo
      const coursePromises = enrollmentSnapshot.docs.map(async (enrollDoc) => {
        const courseId = enrollDoc.data().courseId;
        
        // Step 3: Course ki details fetch karo
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        
        return {
          id: courseDoc.id,
          ...courseDoc.data()
        };
      });

      // Step 4: Saare courses ka data wait karo
      const coursesData = await Promise.all(coursePromises);
      setMyCourses(coursesData);
      
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Courses</h2>
      
      {myCourses.length === 0 ? (
        <p>No courses assigned yet.</p>
      ) : (
        <ul>
          {myCourses.map(course => (
            <li key={course.id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>Duration: {course.duration}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCourses;

