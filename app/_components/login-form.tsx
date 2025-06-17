'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import UserMenu from './user-menu'

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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        try {
          return JSON.parse(storedUser)
        } catch (e) {
          console.error("Failed to parse stored user data:", e)
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    }
    return null
  })
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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

        const lastPlayedStream = localStorage.getItem('lastPlayedStream')
        if (lastPlayedStream) {
          router.push(`/s/${lastPlayedStream}`)
        } else {
          router.refresh()
        }
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
      <div className="ml-4" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <UserMenu user={currentUser} onLogout={handleLogout} />
      </div>
    )
  }

  return (
    <div className="ml-4" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <form onSubmit={handleLogin} className="flex gap-2 items-center">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-sm w-auto min-w-[120px]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded text-sm w-auto min-w-[120px]"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-500
                     text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
        >
          Login
        </button>
        <Link
          href="/signup"
          className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500
                     text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200 text-center"
        >
          Sign Up
        </Link>
      </form>
    </div>
  )
}
