'use client'

import { useCallback } from 'react'

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error'

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // Check if we're in browser environment and vibration is supported
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

    // Check for vibration API support with fallbacks
    const vibrate = navigator.vibrate || (navigator as any).webkitVibrate || (navigator as any).mozVibrate || (navigator as any).msVibrate
    
    if (!vibrate) {
      return
    }

    let pattern: number | number[]

    switch (type) {
      case 'light':
        pattern = 50
        break
      case 'medium':
        pattern = 100
        break
      case 'heavy':
        pattern = 200
        break
      case 'success':
        pattern = [50, 100, 50]
        break
      case 'error':
        pattern = [100, 200, 100, 200, 100]
        break
      default:
        pattern = 50
    }

    try {
      // Use bound method or fallback
      if (vibrate.bind) {
        vibrate.bind(navigator)(pattern)
      } else {
        vibrate(pattern)
      }
    } catch (error) {
      // Silently handle any vibration errors
    }
  }, [])

  return { triggerHaptic }
}
