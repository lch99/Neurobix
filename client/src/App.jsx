import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPortal  from './pages/LoginPortal'
import LoginStudent from './pages/LoginStudent'
import LoginStaff   from './pages/LoginStaff'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard   from './pages/AdminDashboard'
import ParentDashboard  from './pages/ParentDashboard'
import LessonsPage  from './pages/LessonsPage'
import LessonDetail from './pages/LessonDetail'
import ProtectedRoute from './components/ProtectedRoute'
import SessionToast from './components/SessionToast'

export default function App() {
  return (
    <>
    <SessionToast />
    <Routes>
      <Route path="/"               element={<Navigate to="/login" replace />} />
      <Route path="/login"          element={<LoginPortal />} />
      <Route path="/login/student"  element={<LoginStudent />} />
      <Route path="/login/staff"    element={<LoginStaff />} />
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/parent" element={
        <ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>
      } />
      <Route path="/lessons" element={
        <ProtectedRoute><LessonsPage /></ProtectedRoute>
      } />
      <Route path="/lessons/:id" element={
        <ProtectedRoute><LessonDetail /></ProtectedRoute>
      } />
    </Routes>
    </>
  )
}
