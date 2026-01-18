import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './config/redux/store/store'
import './index.css'

import ProtectedRoutes from './components/ProtectedRoutes'
import Login from './pages/Admin/Login'
import StudentDashboard from './pages/Admin/student/StudentDashboard'
import MyCourse from './pages/Student/MyCourse'
import AddCourse from './pages/Admin/courses/AddCourse'
import AddStudent from './pages/Admin/student/AddStudent'
import Courses from './pages/Admin/courses/Courses'
import Profile from './pages/Student/Profile'
import Student from './pages/Admin/student/Student'
import AssignCourse from './pages/Admin/AssignCourse'
import Dashboard from './pages/Admin/Dashboard'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route index element={
          <ProtectedRoutes role={['admin']}>
            <Dashboard/>
          </ProtectedRoutes>
        } />

        <Route path="/students" element={
          <ProtectedRoutes role={['admin']}>
            <Student /> 
          </ProtectedRoutes>
        } />

        <Route path="/students/dashboard" element={
          <ProtectedRoutes role={['admin']}>
            <StudentDashboard />
          </ProtectedRoutes>
        } />

        <Route path="/students/add" element={
          <ProtectedRoutes role={['admin']}>
            <AddStudent />
          </ProtectedRoutes>
        } />

        <Route path="/courses" element={
          <ProtectedRoutes role={['admin']}>
            <Courses />
          </ProtectedRoutes>
        } />

        <Route path="/courses/add" element={
          <ProtectedRoutes role={['admin']}>
            <AddCourse />
          </ProtectedRoutes>
        } />

        <Route path="/assign-course" element={
          <ProtectedRoutes role={['admin']}>
            <AssignCourse />
          </ProtectedRoutes>
        } />

        {/* Student Routes */}
        <Route path="/my-courses" element={
          <ProtectedRoutes role={['student']}>
            <MyCourse />
          </ProtectedRoutes>
        } />

        <Route path="/profile" element={
          <ProtectedRoutes role={['student']}>
            <Profile />
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  </Provider>
)
