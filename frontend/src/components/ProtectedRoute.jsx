import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const hasToken = localStorage.getItem('accessToken')

  let currentUser = user
  if (!currentUser) {
    try {
      const stored = localStorage.getItem('user')
      if (stored) currentUser = JSON.parse(stored)
    } catch {}
  }

  if (!currentUser && !hasToken) {
    return <Navigate to="/login" replace />
  }

  // Role validation
  if (allowedRoles && allowedRoles.length > 0 && currentUser) {
    const role = currentUser.role || 'FLEET_MANAGER'
    const isAllowed = allowedRoles.includes(role) || role === 'ADMIN' || role === 'FLEET_MANAGER'
    
    if (!isAllowed) {
      // Default home per role
      if (role === 'DRIVER') return <Navigate to="/trips" replace />
      if (role === 'SAFETY_OFFICER') return <Navigate to="/vehicles" replace />
      if (role === 'FINANCIAL_ANALYST') return <Navigate to="/dashboard" replace />
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}
