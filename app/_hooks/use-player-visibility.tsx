'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function usePlayerVisibility() {
  const pathname = usePathname()
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  useEffect(() => {
    // The player is visible if we're on a stream page (starts with /s/)
    const playerVisible = pathname.startsWith('/s/')
    setIsPlayerVisible(playerVisible)
  }, [pathname])

  return isPlayerVisible
}
