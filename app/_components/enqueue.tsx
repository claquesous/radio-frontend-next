'use client'

import axios from 'axios'
import { useState } from 'react'

export default function Enqueue(props: { streamId: number, songId: number }) {
  const { streamId, songId } = props
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const requestSong = async () => {
    if (status === 'loading') return
    
    setStatus('loading')
    try {
      const authToken = localStorage.getItem('authToken')

      await axios.post(`/api/streams/${streamId}/requests`, {
        request: {
          song_id: songId,
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        },
      })
      
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000) // Reset after 2 seconds
    } catch (error: any) {
      console.error('There was a problem with the request:', error.response?.data || error.message)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000) // Reset after 3 seconds
    }
  }

  const getIconColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-500'
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Requesting...'
      case 'success':
        return 'Song requested!'
      case 'error':
        return 'Request failed'
      default:
        return 'Add to queue'
    }
  }

  return (
    <div className="flex items-center ml-2">
      <div className="cursor-cell" onClick={requestSong} title={getTitle()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Play-List-5--Streamline-Core" height="24" width="24" className={`${getIconColor()} cursor-cell ${status === 'loading' ? 'animate-pulse' : ''}`}>
          <rect width="24" height="24" fill="transparent" />
          <desc>Play List 5 Streamline Icon: https://streamlinehq.com</desc>
          <g id="play-list-5--player-television-movies-slider-media-tv-players-video-stack-entertainment">
            <path id="Union" fill="currentColor" fillRule="evenodd" d="M0 2.5285714285714285C0 1.1331428571428572 1.1314285714285715 0 2.5285714285714285 0h14.21142857142857c1.397142857142857 0 2.5302857142857142 1.1314285714285715 2.5302857142857142 2.5285714285714285v14.21142857142857c0 1.397142857142857 -1.1314285714285715 2.5302857142857142 -2.5302857142857142 2.5302857142857142h-14.21142857142857A2.532 2.532 0 0 1 0 16.74v-14.21142857142857Zm4.1245714285714286 10.508571428571427a3.0102857142857142 3.0102857142857142 0 0 1 3.4474285714285715 -2.9777142857142858V4.508571428571428a1.2857142857142856 1.2857142857142856 0 0 1 1.2857142857142856 -1.2857142857142856c1.6285714285714283 0 3.214285714285714 0.5828571428571429 4.400571428571428 1.6594285714285713 1.1897142857142855 1.0782857142857143 1.8857142857142857 2.569714285714286 1.8857142857142857 4.155428571428571a1.2857142857142856 1.2857142857142856 0 1 1 -2.571428571428571 0c0 -0.8177142857142856 -0.3548571428571428 -1.6285714285714283 -1.0405714285714285 -2.2508571428571424a3.814285714285714 3.814285714285714 0 0 0 -1.3885714285714286 -0.792v7.011428571428571l0 0.030857142857142854a3.0102857142857142 3.0102857142857142 0 0 1 -6.018857142857143 0ZM23.948571428571427 6a1.2857142857142856 1.2857142857142856 0 0 0 -2.571428571428571 0v14.996571428571427a0.38057142857142856 0.38057142857142856 0 0 1 -0.38057142857142856 0.38057142857142856H6a1.2857142857142856 1.2857142857142856 0 0 0 0 2.571428571428571h14.996571428571427a2.952 2.952 0 0 0 2.952 -2.952V6Z" clipRule="evenodd" strokeWidth="1"></path>
          </g>
        </svg>
      </div>
      {status === 'success' && (
        <span className="ml-2 text-green-600 text-sm">
          Song requested!
        </span>
      )}
    </div>
  )
}
