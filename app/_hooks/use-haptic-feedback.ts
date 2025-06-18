'use client'

import { useCallback } from 'react'

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error'

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    alert(`Haptic feedback triggered: ${type}`)
    
    // Check if the device supports vibration API
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      alert('Vibration API is supported')
      
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
        const result = navigator.vibrate(pattern)
        alert(`Vibration called with pattern: ${JSON.stringify(pattern)}, result: ${result}`)
      } catch (error) {
        alert(`Vibration error: ${error}`)
      }
    } else {
      alert('Vibration API not supported on this device')
    }
  }, [])

  return { triggerHaptic }
}
