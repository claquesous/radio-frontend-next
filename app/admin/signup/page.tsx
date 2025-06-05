'use client'

import React, { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with existing user creation API
    console.log('Signup submitted', { email, password, passwordConfirmation })
    // Example error handling
    if (password !== passwordConfirmation) {
      setErrors(['Password and confirmation do not match'])
    } else {
      setErrors([])
      // Simulate API call
      // if (apiCallFailed) {
      //   setErrors(['Failed to create user'])
      // }
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      {errors.length > 0 && (
        <div className="error_messages">
          <h2>Form is invalid</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password_confirmation">Password Confirmation</label>
          <input
            type="password"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <div className="actions">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  )
}
