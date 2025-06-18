'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export function useScrollText(dependencies: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  const checkOverflow = useCallback(() => {
    if (containerRef.current && textRef.current) {
      // Small delay to ensure the DOM is ready
      requestAnimationFrame(() => {
        if (containerRef.current && textRef.current) {
          const containerWidth = containerRef.current.offsetWidth
          const textWidth = textRef.current.scrollWidth

          setShouldScroll(textWidth > containerWidth)

          if (textWidth > containerWidth) {
            textRef.current.style.setProperty('--container-width', `${containerWidth}px`)
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    // Initial check with delay for component mounting
    const initialCheck = setTimeout(checkOverflow, 50)

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

    return () => {
      clearTimeout(initialCheck)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [...dependencies])

  // Also check when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(checkOverflow, 100)
    return () => clearTimeout(timeoutId)
  }, [...dependencies])

  return { containerRef, textRef, shouldScroll }
}
