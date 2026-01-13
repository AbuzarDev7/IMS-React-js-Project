import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './config/redux/store/store'

import Navbar from './components/Navbar'
import ProtectedRoutes from './components/ProtectedRoutes'

import Login from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'

import StudentDashboard from './pages/Admin/student/StudentDashboard'



import MyCourse from './pages/Student/MyCourse'

import AddCourse from './pages/Admin/courses/AddCourse'
import AddStudent from './pages/Admin/student/AddStudent'
import Courses from './pages/Admin/courses/Courses'
import Profile from './pages/Student/Profile'
import Student from './pages/Admin/student/Student'
import AssignCourse from './pages/Admin/AssignCourse'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoutes role={['Admin']}>
            <Dashboard />
          </ProtectedRoutes>
        } />

        <Route path="/students" element={
          <ProtectedRoutes role={['Admin']}>
            <Student />
          </ProtectedRoutes>
        } />

        <Route path="/students/dashboard" element={
          <ProtectedRoutes role={['Admin']}>
            <StudentDashboard />
          </ProtectedRoutes>
        } />

        <Route path="/students/add" element={
          <ProtectedRoutes role={['Admin']}>
            <AddStudent />
          </ProtectedRoutes>
        } />

        <Route path="/courses" element={
          <ProtectedRoutes role={['Admin']}>
            <Courses />
          </ProtectedRoutes>
        } />

        <Route path="/courses/add" element={
          <ProtectedRoutes role={['Admin']}>
            <AddCourse />
          </ProtectedRoutes>
        } />

        <Route path="/assign-course" element={
          <ProtectedRoutes role={['Admin']}>
            <AssignCourse />
          </ProtectedRoutes>
        } />

        <Route path="/my-courses" element={
          <ProtectedRoutes role={['Student']}>
            <MyCourse />
          </ProtectedRoutes>
        } />

        <Route path="/profile" element={
          <ProtectedRoutes role={['Student']}>
            <Profile />
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  </Provider>
)
