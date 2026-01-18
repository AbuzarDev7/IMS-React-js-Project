import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase/firebase";
import { FaEnvelope, FaUserGraduate, FaIdBadge } from "react-icons/fa";

import StudentNavbar from "../../components/StudentNavbar";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError("Please log in first");
        return;
      }

      try {
        const email = user.email;
        const userQuery = query(collection(db, "users"), where("email", "==", email));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        const studentData = { id: userSnap.docs[0].id, ...userSnap.docs[0].data() };
        setProfile(studentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
  <>
     
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div></>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 rounded-xl border border-red-300 shadow-md text-center">
        <div className="text-5xl mb-3">❌</div>
        <p className="text-red-700 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-yellow-50 rounded-xl border border-yellow-300 shadow-md text-center">
        <div className="text-5xl mb-3">⚠️</div>
        <p className="text-yellow-700 font-semibold text-lg">Profile not found</p>
      </div>
    );
  }

  return (
    
 <>

    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <br />
      <StudentNavbar/>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 shadow-xl">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-lg">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">{profile.name}</h1>
          <p className="mt-1 text-indigo-200 uppercase tracking-wide">{profile.role}</p>
        </div>

        {/* Profile Cards */}
        <div className="mt-8 space-y-5">

          <div className="flex items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <FaUserGraduate className="text-indigo-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-gray-800 font-semibold text-lg">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <FaEnvelope className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-gray-800 font-semibold text-lg break-words">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <FaIdBadge className="text-purple-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-gray-800 font-semibold text-lg capitalize">{profile.role}</p>
            </div>
          </div>

        </div>

      </div>
    </div></>
  );
};

export default StudentProfile;
