import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase/firebase";
import { useSelector } from "react-redux";

export default function MyCourses() {
  const user = useSelector(state => state.auth.user); // Auth user
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "enrollments"),
        where("studentId", "==", user.uid)  // ✅ Match Auth UID
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setCourses([]);
        return;
      }

      const list = [];
      for (const d of snap.docs) {
        const courseSnap = await getDoc(doc(db, "courses", d.data().courseId));
        if (courseSnap.exists()) {
          list.push({ id: courseSnap.id, ...courseSnap.data() });
        }
      }

      setCourses(list);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading your courses...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">My Courses</h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No course assigned yet.</p>
      ) : (
        courses.map(c => (
          <div key={c.id} className="border p-4 rounded mb-4 shadow hover:shadow-md">
            <h3 className="font-semibold text-lg">{c.name}</h3>
            {c.description && <p>{c.description}</p>}
            {c.duration && <p className="text-gray-500">{c.duration}</p>}
          </div>
        ))
      )}
    </div>
  );
}
