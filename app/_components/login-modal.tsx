'use client'

import { useEffect, useRef } from 'react'
import LoginForm from './login-form'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'

      // Focus the modal
      modalRef.current?.focus()
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleLoginSuccess = async (email: string, password: string) => {
    const result = await onLogin(email, password)
    if (result.success) {
      onClose()
    }
    return result
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6
                   animate-in fade-in zoom-in-95 duration-200"
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
                     w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700
                     transition-colors duration-200"
          aria-label="Close login modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal header */}
        <div className="mb-6">
          <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Login form */}
        <div className="space-y-4">
          <LoginForm onLogin={handleLoginSuccess} />
        </div>

        {/* Sign up link */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            onClick={onClose}
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  )
}
