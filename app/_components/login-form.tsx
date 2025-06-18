'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await onLogin(email, password)

    if (result.success) {
      setEmail('')
      setPassword('')
    } else {
      setError(result.error || 'Login failed')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                   text-white font-semibold py-3 px-4 rounded-md text-sm transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        Login
      </button>
    </form>
  )
}
