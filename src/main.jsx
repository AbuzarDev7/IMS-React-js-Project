import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './comonents/Navbar.jsx'
import { BrowserRouter } from 'react-router'
import Login from './pages/Admin/Login.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
     <BrowserRouter>
                                <Navbar/>
                        <Routes>
                                {/* Public */}
                                <Route path='login' element={<Login />} />
                                {/* Protected Route */}

                                {/* PROTECTED */}
                                <Route
                                        index
                                        element={<ProtectedRoutes component={<Dashboard />} role={['Admin']} />}
                                />

                                <Route
                                        path="students"
                                        element={<ProtectedRoutes component={<StudentDashboard />} role={['Admin']} />}
                                />

                                <Route
                                        path="students/dashboard"
                                        element={<ProtectedRoutes component={<StudentDashboard />} role={['Admin']} />}
                                />

                                <Route
                                        path="students/add"
                                        element={<ProtectedRoutes component={<AddStudent />} role={['Admin']} />}
                                />

                                <Route
                                        path="courses"
                                        element={<ProtectedRoutes component={<Courses />} role={['Admin']} />}
                                />

                                <Route
                                        path="courses/add"
                                        element={<ProtectedRoutes component={<AddCourse />} role={['Admin']} />}
                                />

                                <Route
                                        path="assign-course"
                                        element={<ProtectedRoutes component={<AssignCourse />} role={['Admin']} />}
                                />

                                <Route
                                        path="my-courses"
                                        element={<ProtectedRoutes component={<MyCourse />} role={['Student']} />}
                                />

                                <Route
                                        path="profile"
                                        element={<ProtectedRoutes component={<Profile />} role={['Student']} />}
                                />


                        </Routes>
                </Brow>
)
