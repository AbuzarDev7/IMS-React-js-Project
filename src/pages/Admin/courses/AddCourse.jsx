

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Available course categories
  const courseCategories = [
    "Web Development",
    "App Development", 
    "Graphic Design",
    "UI/UX Design",
    "Artificial Intelligence (AI)",
    "Data Science",
    "Digital Marketing",
    "Other"
  ];

  // Pre-made course templates
  const popularCourses = [
    {
      name: "Web Development Bootcamp",
      description: "Complete web development course covering HTML, CSS, JavaScript, React, Node.js, and deployment",
      duration: "6 months",
      category: "Web Development"
    },
    {
      name: "Mobile App Development",
      description: "Learn to build Android and iOS apps using React Native and Flutter",
      duration: "4 months",
      category: "App Development"
    },
    {
      name: "Graphic Design Masterclass",
      description: "Master Adobe Photoshop, Illustrator, and design principles for branding and marketing",
      duration: "3 months",
      category: "Graphic Design"
    },
    {
      name: "UI/UX Design Professional",
      description: "Learn user interface and user experience design with Figma, wireframing, and prototyping",
      duration: "4 months",
      category: "UI/UX Design"
    },
    {
      name: "Artificial Intelligence & Machine Learning",
      description: "Deep dive into AI, ML algorithms, Python, TensorFlow, and neural networks",
      duration: "8 months",
      category: "Artificial Intelligence (AI)"
    }
  ];

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Use a template to auto-fill form
  const useTemplate = (template) => {
    setFormData({
      name: template.name,
      description: template.description,
      duration: template.duration,
      category: template.category
    });
    // Scroll to top to see filled form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔄 Adding course...", formData);

    
      await addDoc(collection(db, "courses"), {
        courseName: formData.name,  
        description: formData.description,
        duration: formData.duration,
        category: formData.category,
        createdAt: new Date().toISOString(),
        status: "active"
      });

      // console.log("Course added successfully!");
      alert(` Course "${formData.name}" successfully added!`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        duration: "",
        category: ""
      });

    } catch (error) {
      // console.error(" Error adding course:", error);
      alert(" Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/*  HEADER*/}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="text-5xl">📚</span>
            Add New Course
          </h1>
          <p className="text-green-100 mt-2 text-lg">
            Create a new course for students to enroll in
          </p>
        </div>

        {/* ========== MAIN FORM */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* COURSE NAME */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                📝 Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Web Development Bootcamp"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:border-green-500 text-lg"
                required
              />
            </div>

            {/* COURSE CATEGORY */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                🏷️ Course Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:border-green-500 text-lg"
                required
              >
                <option value="">-- Select Category --</option>
                {courseCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* COURSE DESCRIPTION */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                📄 Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:border-green-500 text-lg resize-none"
                required
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length} characters
              </p>
            </div>

            {/* COURSE DURATION */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                ⏱️ Course Duration <span className="text-red-500">*</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:border-green-500 text-lg"
                required
              >
                <option value="">-- Select Duration --</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="4 months">4 months</option>
                <option value="5 months">5 months</option>
                <option value="6 months">6 months</option>
                <option value="8 months">8 months</option>
                <option value="12 months">12 months (1 year)</option>
              </select>
            </div>

            {/* FORM PREVIEW */}
            {formData.name && formData.category && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
                <p className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👁️</span> Course Preview
                </p>
                <div className="space-y-2">
                  <p className="text-green-700">
                    <strong>📚 Name:</strong> {formData.name}
                  </p>
                  <p className="text-green-700">
                    <strong>🏷️ Category:</strong> {formData.category}
                  </p>
                  {formData.duration && (
                    <p className="text-green-700">
                      <strong>⏱️ Duration:</strong> {formData.duration}
                    </p>
                  )}
                  {formData.description && (
                    <p className="text-green-700">
                      <strong>📄 Description:</strong> {formData.description.substring(0, 100)}
                      {formData.description.length > 100 ? "..." : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SUBMIT BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 disabled:bg-green-300 transition-colors font-bold text-lg shadow-lg"
              >
                {loading ? "⏳ Adding Course..." : "✅ Add Course"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-400 transition-colors font-bold text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* ========== POPULAR COURSE TEMPLATES ========== */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">⚡</span> Quick Add - Popular Courses
          </h2>
          <p className="text-gray-600 mb-6">
            Click on any template to auto-fill the form
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularCourses.map((course, index) => (
              <div 
                key={index}
                onClick={() => useTemplate(course)}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{course.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {course.description.substring(0, 80)}...
                </p>
                <p className="text-xs text-gray-500">
                  ⏱️ Duration: {course.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INFO BOX */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5">
          <p className="text-sm text-blue-800">
            <strong>💡 Pro Tip:</strong> Write clear and detailed course descriptions 
            to help students understand what they'll learn. Include key topics and skills.
          </p>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-5">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important:</strong> Courses are saved with field name "courseName" 
            to match the enrollment system. This ensures proper course display for students.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;