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

        setShouldScroll(textWidth > containerWidth)

        if (textWidth > containerWidth) {
          textRef.current.style.setProperty('--container-width', `${containerWidth}px`)
        }
      }
    }

    // Check on mount and when content changes
    checkOverflow()

    const resizeObserver = new ResizeObserver(checkOverflow)
    const mutationObserver = new MutationObserver(checkOverflow)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    if (textRef.current) {
      mutationObserver.observe(textRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    // Also check when layout potentially changes
    const timeoutId = setTimeout(checkOverflow, 100)

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      clearTimeout(timeoutId)
    }
  })

  return { containerRef, textRef, shouldScroll }
}
