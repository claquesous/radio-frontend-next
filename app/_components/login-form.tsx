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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsHydrated(true)
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

  if (!isHydrated) {
    return <div className="inline-block ml-4"></div>
  }

  if (currentUser) {
    return (
      <div className="inline-block ml-4 align-middle">
        <UserMenu user={currentUser} onLogout={handleLogout} />
      </div>
    )
  }

  return (
    <div className="inline-block ml-4 align-middle">
      <form onSubmit={handleLogin} className="inline-block">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded text-sm w-full sm:w-auto min-w-0 sm:min-w-[120px]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded text-sm w-full sm:w-auto min-w-0 sm:min-w-[120px]"
            required
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-500
                         text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="flex-1 sm:flex-none bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500
                         text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200 text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
