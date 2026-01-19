import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/firebase/firebase";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";



const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!name || !email || !password) {
      return alert("Please fill all fields!");
    }

    setLoading(true);
    
    try {

      const studentData = {
        name,
        email,
        role: "student",
        password, 
        createdAt: new Date(),
        isActive: true,
       
      };

      await addDoc(collection(db, "users"), studentData);

      alert("Student added successfully! Student can now login with provided credentials.");
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(error);
      alert("Failed to add student: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Add New Student
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter student name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="student@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter password"
          />
        </div>
        <button
          onClick={handleAddStudent}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </div>
  );
};

export default AddStudent;