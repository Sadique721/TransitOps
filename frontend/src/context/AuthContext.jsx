import { createContext, useContext, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const navigate = useNavigate()

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const u = { name: data.name, email: data.email, role: data.role, userId: data.userId }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    // Role-based redirect (Section 7.1)
    navigate(u.role === 'DRIVER' ? '/trips' : '/dashboard')
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
