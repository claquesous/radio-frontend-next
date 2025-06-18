'use client'
import { useAudio } from '../_contexts/audio-context'
import { usePlayerVisibility } from '../_hooks/use-player-visibility'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function MiniPlayer() {
  const { 
    isPlaying, 
    nowPlaying, 
    currentStreamId,
    currentStreamName,
    stopStream,
    analyserRef,
    dataArrayRef
  } = useAudio()

  const isPlayerVisible = usePlayerVisibility()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Don't show the mini player if nothing is playing or the main player is visible
  if (!isPlaying || !currentStreamId || isPlayerVisible) {
    return null
  }

  useEffect(() => {
    if (isPlaying && analyserRef.current && dataArrayRef.current) {
      startVisualization()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isPlaying, analyserRef.current, dataArrayRef.current])

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    const bufferLength = analyser.frequencyBinCount
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    
    resizeCanvas()
    
    const draw = () => {
      if (!isPlaying) return
      
      analyser.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgb(71, 85, 105)' // slate-600 background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Show fewer frequency bins for mini visualization
      const usefulBins = Math.floor(bufferLength * 0.3) // Even fewer bins for mini view
      const barWidth = canvas.width / usefulBins
      let x = 0
      
      for (let i = 0; i < usefulBins; i++) {
        const normalizedValue = dataArray[i] / 255
        const barHeight = Math.max(1, normalizedValue * canvas.height * 0.8)
        
        // Use theme colors: blue (low) to red (high)
        const intensity = i / usefulBins
        const blue = Math.floor(200 - (intensity * 150)) // Start from lighter blue
        const red = Math.floor(intensity * 200)
        const color = `rgb(${red}, 50, ${blue})`
        
        ctx.fillStyle = color
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        
        x += barWidth
      }
      
      if (animationRef.current !== null) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }
    
    animationRef.current = 1
    draw()
  }

  function NowPlayingDisplay() {
    if (typeof nowPlaying === 'string') {
      return (
        <div className="text-sm text-slate-200 max-w-48 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll-text">
            {nowPlaying}
          </div>
        </div>
      )
    } else {
      const fullText = `${nowPlaying.artist} - ${nowPlaying.title}`
      return (
        <div className="text-sm text-slate-200 max-w-48 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll-text">
            <Link 
              href={`/s/${currentStreamId}/artists/${nowPlaying.artist_id}`}
              className="hover:text-slate-100"
            >
              {nowPlaying.artist}
            </Link>
            {' - '}
            <Link 
              href={`/s/${currentStreamId}/songs/${nowPlaying.song_id}`}
              className="hover:text-slate-100"
            >
              {nowPlaying.title}
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex items-center space-x-2 bg-slate-600 rounded px-3 py-1 max-w-md">
      {/* Now Playing Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="text-xs text-slate-300">
          <Link 
            href={`/s/${currentStreamId}`}
            className="hover:text-slate-100"
          >
            {currentStreamName}
          </Link>
        </div>
        <NowPlayingDisplay />
      </div>
      
      {/* Audio Visualization */}
      <div className="w-24 h-6 bg-slate-700 rounded border border-slate-500 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            imageRendering: 'pixelated',
            display: 'block'
          }}
        />
      </div>
      
      {/* Stop Button */}
      <button
        onClick={stopStream}
        className="p-1 bg-slate-500 rounded hover:bg-slate-400 transition-colors"
        title="Stop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 text-slate-200"
        >
          <rect x="6" y="6" width="12" height="12" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
