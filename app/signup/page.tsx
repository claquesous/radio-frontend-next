'use client'

import React, { useState } from 'react'
import axios from 'axios'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setSuccess(false)

    if (password !== passwordConfirmation) {
      setErrors(['Password and confirmation do not match'])
      return
    }

    try {
      const response = await axios.post('/api/users', {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
        }
      })
      setSuccess(true)
      setEmail('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else if (error.response?.data?.error) {
        setErrors([error.response.data.error])
      } else {
        setErrors([error.message || 'Failed to create user'])
      }
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      {success && (
        <div className="text-green-600 mb-2">
          Account created successfully! You may now log in.
        </div>
      )}
      {errors.length > 0 && (
        <div className="error_messages text-red-600 mb-2">
          <h2>Form is invalid</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="field mb-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field mb-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="field mb-2">
          <label htmlFor="password_confirmation">Password Confirmation</label>
          <input
            type="password"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="actions">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  )
}
