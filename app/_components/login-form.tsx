'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface AuthResponse {
  token: string
  user: any
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear previous errors

    try {
      const response = await axios.post<AuthResponse>('/api/login', {
        email,
        password,
      })

      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        router.push('/') // Redirect to home or dashboard
        // Optionally, refresh the page to update auth state in other components
        router.refresh()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
      console.error('Login error:', err)
    }
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
