'use client'

import { useCallback } from 'react'

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error'

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // Check if the device supports vibration API
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      let pattern: number | number[]

      switch (type) {
        case 'light':
          pattern = 10
          break
        case 'medium':
          pattern = 20
          break
        case 'heavy':
          pattern = 30
          break
        case 'success':
          pattern = [10, 50, 10]
          break
        case 'error':
          pattern = [20, 100, 20, 100, 20]
          break
        default:
          pattern = 10
      }

      try {
        navigator.vibrate(pattern)
      } catch (error) {
        // Silently handle any vibration errors
        console.debug('Haptic feedback not available:', error)
      }
    }
  }, [])

  return { triggerHaptic }
}
