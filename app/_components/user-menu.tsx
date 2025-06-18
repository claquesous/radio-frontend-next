'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  admin: boolean
}

interface UserMenuProps {
  user: User
  onLogout: () => void
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  const handleLogout = () => {
    onLogout()
    setIsOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block pr-2" ref={menuRef}>
      {/* Avatar Circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-slate-600 dark:hover:bg-slate-500
                   text-white font-semibold text-sm flex items-center justify-center
                   transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-slate-400
                   shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150"
        aria-label={`User menu for ${user.email}`}
        aria-expanded={isOpen}
      >
        {getInitial(user.email)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg
                        border border-gray-200 dark:border-slate-700 py-1 z-50
                        animate-in fade-in duration-200">
          {/* User Info */}
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700">
            <div className="font-medium truncate">{user.email}</div>
            {user.admin && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Administrator</div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {user.admin && (
              <button
                onClick={() => {
                  router.push('/admin')
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                           hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700
                           transition-colors duration-150 bg-transparent border-none outline-none
                           font-normal rounded-none shadow-none"
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={() => {
                router.push('/manage')
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                         hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700
                         transition-colors duration-150 bg-transparent border-none outline-none
                         font-normal rounded-none shadow-none"
            >
              Manage Streams
            </button>

            <hr className="my-1 border-gray-200 dark:border-slate-700" />

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400
                         hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20
                         transition-colors duration-150 bg-transparent border-none outline-none
                         font-normal rounded-none shadow-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
