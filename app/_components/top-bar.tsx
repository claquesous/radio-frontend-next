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
        if (lastPlayedStream) {
          router.push(`/s/${lastPlayedStream}`)
        } else {
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
