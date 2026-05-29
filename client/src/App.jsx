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

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Navigate to="/login" replace />} />
      <Route path="/login"          element={<LoginPortal />} />
      <Route path="/login/student"  element={<LoginStudent />} />
      <Route path="/login/staff"    element={<LoginStaff />} />
      <Route path="/student"        element={<StudentDashboard />} />
      <Route path="/teacher"        element={<TeacherDashboard />} />
      <Route path="/admin"          element={<AdminDashboard />} />
      <Route path="/parent"         element={<ParentDashboard />} />
      <Route path="/lessons"        element={<LessonsPage />} />
      <Route path="/lessons/:id"    element={<LessonDetail />} />
    </Routes>
  )
}
