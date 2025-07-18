'use client'
import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useAudio } from '../_contexts/audio-context'
import { useScrollText } from '../_hooks/use-scroll-text'
import LoveIt from './love-it'
import HateIt from './hate-it'

const VOLUME_INCREMENTS = 10

function getStreams(url: string) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Fetch failed')
      }
      return res.json()
    })
}

export default function GlobalPlayer(props: { streamId: number }) {
  const { streamId } = props
  const { data: stream, error, isLoading, isValidating } = useSWR(`/api/streams/${streamId}`, getStreams, {
    revalidateOnFocus: false
  })

  const {
    isPlaying,
    volume,
    nowPlaying,
    canVote,
    currentStreamId,
    startStream,
    stopStream,
    setVolume,
    analyserRef,
    dataArrayRef,
    visualizationReady
  } = useAudio()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const collapseAnimationRef = useRef<number | null>(null)
  const lastBarHeightsRef = useRef<number[]>([])

  const streamNameScroll = useScrollText()
  const nowPlayingScroll = useScrollText()

  // Check if this player is for the currently playing stream
  const isCurrentStream = currentStreamId === Number(streamId) || currentStreamId === streamId

  const startCollapseAnimation = useCallback(() => {
    if (!canvasRef.current || lastBarHeightsRef.current.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const startTime = Date.now()
    const animationDuration = 300
    const initialBarHeights = [...lastBarHeightsRef.current]
    const bufferLength = analyserRef.current?.frequencyBinCount || 64
    const usefulBins = Math.floor(bufferLength * 0.5)
    const barWidth = canvas.width / usefulBins

    const collapseFrame = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let x = 0
      for (let i = 0; i < usefulBins; i++) {
        const initialHeight = initialBarHeights[i] || 1
        const barHeight = initialHeight * (1 - easeOutProgress)

        const intensity = i / usefulBins
        const blue = Math.floor(255 - (intensity * 255))
        const red = Math.floor(intensity * 255)
        const color = `rgb(${red}, 0, ${blue})`

        ctx.fillStyle = color
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth
      }

      if (progress < 1) {
        collapseAnimationRef.current = requestAnimationFrame(collapseFrame)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#111111'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        collapseAnimationRef.current = null
      }
    }

    collapseFrame()
  }, [analyserRef])

  const startVisualization = useCallback(() => {
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

    setTimeout(resizeCanvas, 50)

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)

    const cleanup = () => {
      window.removeEventListener('resize', handleResize)
    }

    const draw = () => {
      if (!isCurrentStream || !isPlaying) {
        cleanup()
        return
      }

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const usefulBins = Math.floor(bufferLength * 0.5)
      const barWidth = canvas.width / usefulBins
      let x = 0
      const currentBarHeights: number[] = []

      for (let i = 0; i < usefulBins; i++) {
        const normalizedValue = dataArray[i] / 255
        const barHeight = Math.max(1, normalizedValue * canvas.height * 0.8)
        currentBarHeights.push(barHeight)

        const intensity = i / usefulBins
        const blue = Math.floor(255 - (intensity * 255))
        const red = Math.floor(intensity * 255)
        const color = `rgb(${red}, 0, ${blue})`

        ctx.fillStyle = color
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth
      }

      lastBarHeightsRef.current = currentBarHeights

      if (animationRef.current !== null) {
        animationRef.current = requestAnimationFrame(draw)
      } else {
        cleanup()
      }
    }

    animationRef.current = 1
    draw()
  }, [isCurrentStream, isPlaying, analyserRef, dataArrayRef])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (collapseAnimationRef.current) {
        cancelAnimationFrame(collapseAnimationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isCurrentStream && isPlaying && visualizationReady) {
      // Stop any existing animation first
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      // Check periodically for audio context to be ready
      const checkAndStartVisualization = () => {
        if (analyserRef.current && dataArrayRef.current && canvasRef.current) {
          startVisualization()
        } else {
          timeoutId = setTimeout(checkAndStartVisualization, 100)
        }
      }

      // Add a small delay to ensure DOM is ready when switching views
      timeoutId = setTimeout(checkAndStartVisualization, 50)
    } else {
      // Stop visualization and start collapse animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (lastBarHeightsRef.current.length > 0) {
        startCollapseAnimation()
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isCurrentStream, isPlaying, visualizationReady, startCollapseAnimation, startVisualization, analyserRef, dataArrayRef])

  const handleStartStream = () => {
    if (stream) {
      startStream(streamId, stream.name)
    }
  }

  const crankIt = () => {
    const newVolume = Math.min(volume + 1, VOLUME_INCREMENTS)
    setVolume(newVolume)
  }

  const tooLoud = () => {
    const newVolume = Math.max(volume - 1, 0)
    setVolume(newVolume)
  }

  const getVolumeColor = (index: number) => {
    if (index >= volume) {
      return 'rgb(75, 85, 99)'
    }
    const volumeLevel = index / VOLUME_INCREMENTS
    const blue = 255 - Math.floor(volumeLevel * 255)
    const red = Math.floor(volumeLevel * 255)
    return `rgb(${red}, 0, ${blue})`
  }

  if (error || isLoading || isValidating) {
    return <div />
  }

  function NowPlayingDisplay() {
    if (typeof nowPlaying === 'string') {
      return (
        <div
          ref={nowPlayingScroll.containerRef}
          className="overflow-hidden scroll-container"
        >
          <div
            ref={nowPlayingScroll.textRef}
            className={`scroll-text ${nowPlayingScroll.shouldScroll ? 'animate-scroll-text' : ''}`}
          >
            {nowPlaying}
          </div>
        </div>
      )
    } else {
      return (
        <div
          ref={nowPlayingScroll.containerRef}
          className="overflow-hidden scroll-container"
        >
          <div
            ref={nowPlayingScroll.textRef}
            className={`scroll-text ${nowPlayingScroll.shouldScroll ? 'animate-scroll-text' : ''}`}
          >
            <Link href={`/s/${streamId}/artists/${nowPlaying.artist_id}`}>{nowPlaying.artist}</Link> - <Link href={`/s/${streamId}/songs/${nowPlaying.song_id}`}>{nowPlaying.title}</Link>
          </div>
        </div>
      )
    }
  }

  return <div
    data-testid="global-player"
    className="w-80 p-2 m-4 shadow rounded-lg bg-slate-200 dark:bg-slate-700 dark:text-white"
  >
    <div>
      <h2 className="flex items-center">
        Current stream:
        <div
          ref={streamNameScroll.containerRef}
          className="ml-1 overflow-hidden scroll-container flex-1 min-w-0"
        >
          <div
            ref={streamNameScroll.textRef}
            className={`scroll-text ${streamNameScroll.shouldScroll ? 'animate-scroll-text' : ''}`}
          >
            <Link href={`/s/${streamId}`}>{stream?.name ?? 'None selected'}</Link>
          </div>
        </div>
      </h2>
    </div>

    {isCurrentStream ? <NowPlayingDisplay /> : <p>Not currently playing</p>}

    {/* Audio Visualization */}
    <div className="my-4 p-2 bg-black rounded border-2 border-gray-600 relative" style={{height: '80px'}}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: 'pixelated',
          display: 'block',
          backgroundColor: '#000000'
        }}
      />
    </div>

    <div className="flex space-x-1">
      <button
        onClick={isCurrentStream && isPlaying ? stopStream : handleStartStream}
        className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500"
        style={{ backgroundColor: isCurrentStream && isPlaying ? '#ef4444' : '#10b981' }}
      >
        {isCurrentStream && isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <rect x="6" y="6" width="12" height="12" fill="currentColor" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
          </svg>
        )}
      </button>
      <div
        onClick={tooLoud}
        className="w-4 h-6 bg-gray-400 rounded-lg hover:bg-gray-500 text-center cursor-pointer"
      >-</div>
      {[...Array(VOLUME_INCREMENTS)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-6 rounded-sm"
          style={{backgroundColor: getVolumeColor(i)}}
        ></div>
      ))}
      <div
        onClick={crankIt}
        className="w-4 h-6 bg-gray-400 rounded-lg hover:bg-gray-500 text-center cursor-pointer"
      >+</div>
      {canVote && isCurrentStream && typeof nowPlaying != 'string' && <>
        <LoveIt
          streamId={streamId}
          playId={nowPlaying.id}
        />
        <HateIt
          streamId={streamId}
          playId={nowPlaying.id}
        />
      </>}
    </div>
  </div>
}
