'use client'

import { useState, useLayoutEffect } from 'react'
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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  useLayoutEffect(() => {
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
    setIsReady(true)
  }, [])

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

  const handleLogout = async () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    try {
      await axios.delete('/api/logout')
    } catch (err) {
      // Ignore errors, just ensure cookie is cleared server-side
    }
    setCurrentUser(null)
    router.push('/')
  }

  return (
    <div 
      className="relative"
      style={{ 
        opacity: isReady ? 1 : 0,
        transition: 'opacity 150ms ease-in'
      }}
    >
      {currentUser ? (
        <UserMenu user={currentUser} onLogout={handleLogout} />
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center">
          {error && (
            <div className="text-red-500 text-xs sm:text-sm order-first sm:order-none whitespace-nowrap">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded text-sm w-full sm:w-auto sm:min-w-[100px] lg:min-w-[120px]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded text-sm w-full sm:w-auto sm:min-w-[100px] lg:min-w-[120px]"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-500
                         text-white font-bold py-2 px-3 sm:px-4 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500
                         text-white font-bold py-2 px-3 sm:px-4 rounded text-sm transition-colors duration-200 text-center flex-1 sm:flex-none"
            >
              Sign Up
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
