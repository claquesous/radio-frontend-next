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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center">
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
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 rounded text-sm w-full sm:w-auto sm:min-w-[100px] lg:min-w-[120px]"
        required
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-500
                     text-white font-bold py-2 px-3 sm:px-4 rounded text-sm transition-colors duration-200 flex-1 sm:flex-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
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
  )
}
