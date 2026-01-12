import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'

import Dashboard from './pages/Admin/Dashboard.jsx'
import Login from './pages/Admin/Login.jsx'
import Student from './pages/Admin/student/Student.jsx'
import StudentDashboard from './pages/Admin/student/StudentDashboard.jsx'
import AddStudent from './pages/Admin/student/AddStudent.jsx'
import Courses from './pages/Admin/courses/Courses.jsx'
import AddCourse from './pages/Admin/courses/AddCourse.jsx'
import AssignCourse from './pages/Admin/AssignCourse.jsx'
import MyCourse from './pages/Student/MyCourse.jsx'
import Profile from './pages/Student/Profile.jsx'

import { Provider } from 'react-redux'
import { store } from './config/redux/store/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      {/* Navbar always shown */}
      <Navbar />

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={<ProtectedRoutes role={['Admin']}><Dashboard /></ProtectedRoutes>}
        />

        <Route
          path="/students"
          element={<ProtectedRoutes role={['Admin']}><Student /></ProtectedRoutes>}
        />

        <Route
          path="/students/dashboard"
          element={<ProtectedRoutes role={['Admin']}><StudentDashboard /></ProtectedRoutes>}
        />

        <Route
          path="/students/add"
          element={<ProtectedRoutes role={['Admin']}><AddStudent /></ProtectedRoutes>}
        />

        <Route
          path="/courses"
          element={<ProtectedRoutes role={['Admin']}><Courses /></ProtectedRoutes>}
        />

        <Route
          path="/courses/add"
          element={<ProtectedRoutes role={['Admin']}><AddCourse /></ProtectedRoutes>}
        />

        <Route
          path="/assign-course"
          element={<ProtectedRoutes role={['Admin']}><AssignCourse /></ProtectedRoutes>}
        />

        <Route
          path="/my-courses"
          element={<ProtectedRoutes role={['Student']}><MyCourse /></ProtectedRoutes>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoutes role={['Student']}><Profile /></ProtectedRoutes>}
        />
      </Routes>
    </BrowserRouter>
  </Provider>
)
