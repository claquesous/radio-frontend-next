'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
  id: number
  email: string
  admin: boolean
}

interface AuthResponse {
  token: string
  user: User
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user data:", e)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear previous errors

    try {
      const response = await axios.post<AuthResponse>('/api/login', {
        email,
        password,
      })

      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setCurrentUser(response.data.user)
        setEmail('')
        setPassword('')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
      console.error('Login error:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setCurrentUser(null)
    router.refresh()
  }

  if (currentUser) {
    return (
      <div className="inline-block ml-4 text-white">
        <span>Welcome, {currentUser.email}!</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="inline-block ml-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-1 mr-2 rounded text-black"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-1 mr-2 rounded text-black"
        required
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
        Login
      </button>
    </form>
  )
}
