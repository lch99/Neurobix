import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ForceCredentialChange from './ForceCredentialChange'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  if (user.mustChangeCredential) {
    return <ForceCredentialChange />
  }

  return children
}
