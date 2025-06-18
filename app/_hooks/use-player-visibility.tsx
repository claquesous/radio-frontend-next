'use client'
import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export function usePlayerVisibility() {
  const pathname = usePathname()
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  const checkPlayerVisibility = useCallback(() => {
    // Only check if we're on a stream page
    if (!pathname.startsWith('/s/')) {
      setIsPlayerVisible(false)
      return
    }

    // Look for the global player element
    const playerElement = document.querySelector('[data-testid="global-player"]') ||
                         document.querySelector('.global-player') ||
                         // Fallback: look for any element that might be the player
                         Array.from(document.querySelectorAll('div')).find(el =>
                           el.textContent?.includes('Current stream:') ||
                           el.className.includes('shadow') && el.className.includes('rounded-lg')
                         )

    if (!playerElement) {
      // If we can't find the player, assume it's visible on stream pages
      setIsPlayerVisible(true)
      return
    }

    // Check if the player is in the viewport
    const rect = playerElement.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    setIsPlayerVisible(isInViewport)
  }, [pathname])

  useEffect(() => {
    // Initial check
    checkPlayerVisibility()

    // Set up scroll listener only for stream pages
    if (pathname.startsWith('/s/')) {
      const handleScroll = () => {
        checkPlayerVisibility()
      }

      // Use passive listener for better performance
      window.addEventListener('scroll', handleScroll, { passive: true })

      // Also check on resize
      window.addEventListener('resize', checkPlayerVisibility, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', checkPlayerVisibility)
      }
    }
  }, [pathname, checkPlayerVisibility])

  return isPlayerVisible
}
