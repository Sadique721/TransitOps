import { createContext, useContext, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const u = { name: data.name, email: data.email, role: data.role, userId: data.userId }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    
    // Role-based landing redirection
    if (u.role === 'DRIVER') {
      navigate('/trips')
    } else if (u.role === 'SAFETY_OFFICER') {
      navigate('/vehicles')
    } else {
      navigate('/dashboard')
    }
  }

  async function register(name, email, password, role) {
    await api.post('/auth/register', { name, email, password, role })
    await login(email, password)
  }

  function logout() {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
