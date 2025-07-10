'use client'

import { useState, useLayoutEffect } from 'react'
import Link from 'next/link'
import LoginModal from './login-modal'
import LoginButton from './login-button'
import MiniPlayer from './mini-player'
import UserMenu from './user-menu'
import { useAudio } from '../_contexts/audio-context'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
  id: number
  email: string
  admin: boolean
}

interface AuthResponse {
  token: string
  user: User
}

function decodeJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export default function TopBar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { stopStream } = useAudio()
  const router = useRouter()

  useLayoutEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      const exp = decodeJwtExp(storedToken)
      const now = Math.floor(Date.now() / 1000)
      if (exp && exp < now) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        setCurrentUser(null)
      } else {
        try {
          setCurrentUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Failed to parse stored user data:", e)
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    }
    setIsReady(true)

    // Listen for global login modal open event
    const openModal = () => setIsLoginModalOpen(true)
    window.addEventListener('open-login-modal', openModal)
    return () => window.removeEventListener('open-login-modal', openModal)
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>('/api/login', {
        email,
        password,
      })

      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setCurrentUser(response.data.user)

        const lastPlayedStream = localStorage.getItem('lastPlayedStream')
        let redirected = false
        if (lastPlayedStream) {
          try {
            const parsed = JSON.parse(lastPlayedStream)
            if (parsed && parsed.id) {
              router.push(`/s/${parsed.id}`)
              redirected = true
            }
          } catch {
            // ignore parse error, will refresh below
          }
        }
        if (!redirected) {
          router.refresh()
        }
        return { success: true }
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed'
      }
    }
    return { success: false, error: 'Login failed' }
  }

  const handleLogout = async () => {
    // Stop any playing stream when logging out
    stopStream()

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
    <div className="flex items-center justify-between px-2 sm:px-4">
      <Link className="text-xl text-slate-200 flex-shrink-0" href="/">
        Claq Radio
      </Link>

      <div className="flex items-center space-x-4 min-h-[2.5rem]">
        {isReady ? (
          currentUser ? (
            <>
              <MiniPlayer />
              <UserMenu user={currentUser} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <LoginButton onClick={() => setIsLoginModalOpen(true)} />
              <Link
                href="/signup"
                className="ml-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-400 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150"
              >
                Sign Up
              </Link>
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
              />
            </>
          )
        ) : (
          <div className="h-10 w-64"></div>
        )}
      </div>
    </div>
  )
}
