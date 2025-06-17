'use client'

import { useState } from 'react'
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

interface LoginFormProps {
  initialUser?: User | null
}

export default function LoginForm({ initialUser = null }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser)
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

  const handleLogout = async () => {
    try {
      await axios.delete('/api/logout')
    } catch (err) {
      console.error('Logout error:', err)
    }
    setCurrentUser(null)
    router.refresh()
  }

  return (
    <div className="ml-4" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {currentUser ? (
        <UserMenu user={currentUser} onLogout={handleLogout} />
      ) : (
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
      )}
    </div>
  )
}
