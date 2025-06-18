'use client'
import { useAudio } from '../_contexts/audio-context'
import { usePlayerVisibility } from '../_hooks/use-player-visibility'
import Link from 'next/link'

const VOLUME_INCREMENTS = 10

export default function MiniPlayer() {
  const { 
    isPlaying, 
    volume, 
    nowPlaying, 
    canVote, 
    currentStreamId,
    currentStreamName,
    stopStream,
    setVolume 
  } = useAudio()

  const isPlayerVisible = usePlayerVisibility()

  // Don't show the mini player if nothing is playing or the main player is visible
  if (!isPlaying || !currentStreamId || isPlayerVisible) {
    return null
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

  function NowPlayingDisplay() {
    if (typeof nowPlaying === 'string') {
      return (
        <span className="text-sm text-slate-200 truncate max-w-48">
          {nowPlaying}
        </span>
      )
    } else {
      return (
        <span className="text-sm text-slate-200 truncate max-w-48">
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
        </span>
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
      
      {/* Controls */}
      <div className="flex items-center space-x-1">
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
        
        {/* Volume Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={tooLoud}
            className="w-4 h-4 bg-slate-500 rounded text-xs hover:bg-slate-400 text-slate-200 flex items-center justify-center transition-colors"
            title="Volume Down"
          >
            -
          </button>
          
          {/* Volume Bars - show fewer for compact view */}
          {[...Array(Math.floor(VOLUME_INCREMENTS / 2))].map((_, i) => {
            const volumeIndex = i * 2
            return (
              <div
                key={i}
                className="w-1 h-3 rounded-sm"
                style={{ backgroundColor: getVolumeColor(volumeIndex) }}
              />
            )
          })}
          
          <button
            onClick={crankIt}
            className="w-4 h-4 bg-slate-500 rounded text-xs hover:bg-slate-400 text-slate-200 flex items-center justify-center transition-colors"
            title="Volume Up"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
