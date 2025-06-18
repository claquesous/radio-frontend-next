'use client'
import { useEffect, useRef, useState } from 'react'

export function useScrollText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const textWidth = textRef.current.scrollWidth

        const needsScroll = textWidth > containerWidth
        setShouldScroll(needsScroll)

        if (needsScroll) {
          textRef.current.style.setProperty('--container-width', `${containerWidth}px`)
        }
      }
    }

    // Force multiple checks
    const checkTimes = [0, 50, 100, 200, 500, 1000]
    const timeouts = checkTimes.map(delay => setTimeout(checkOverflow, delay))

    // Also check on resize
    window.addEventListener('resize', checkOverflow)

    return () => {
      timeouts.forEach(clearTimeout)
      window.removeEventListener('resize', checkOverflow)
    }
  }) // No dependencies - run on every render

  return { containerRef, textRef, shouldScroll }
}
