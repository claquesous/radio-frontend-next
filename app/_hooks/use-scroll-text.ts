'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export function useScrollText(key?: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  const checkOverflow = useCallback(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const textWidth = textRef.current.scrollWidth

      const needsScroll = textWidth > containerWidth
      setShouldScroll(needsScroll)

      if (needsScroll) {
        textRef.current.style.setProperty('--container-width', `${containerWidth}px`)
      }
    }
  }, [])

  useEffect(() => {
    // Reset state when key changes
    setShouldScroll(false)

    // Multiple checks to ensure we catch the content when it's ready
    const timeouts = [
      setTimeout(checkOverflow, 0),
      setTimeout(checkOverflow, 50),
      setTimeout(checkOverflow, 100),
      setTimeout(checkOverflow, 200)
    ]

    const resizeObserver = new ResizeObserver(checkOverflow)
    const mutationObserver = new MutationObserver(() => {
      // Delay the check slightly after mutation
      setTimeout(checkOverflow, 10)
    })

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
      timeouts.forEach(clearTimeout)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [key, checkOverflow])

  return { containerRef, textRef, shouldScroll }
}
