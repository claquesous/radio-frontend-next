'use client'
import { useAudio } from '../_contexts/audio-context'
import useSWR from 'swr'

interface StreamPlayButtonProps {
  streamId: number
  className?: string
  children?: React.ReactNode
}

function getStreams(url: string) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Fetch failed')
      }
      return res.json()
    })
}

export default function StreamPlayButton({ streamId, className = '', children }: StreamPlayButtonProps) {
  const { data: stream, error, isLoading } = useSWR(`/api/streams/${streamId}`, getStreams, {
    revalidateOnFocus: false
  })

  const {
    isPlaying,
    currentStreamId,
    startStream,
    stopStream
  } = useAudio()

  const isCurrentStream = currentStreamId === streamId
  const isStreamPlaying = isCurrentStream && isPlaying

  const handleClick = () => {
    if (isStreamPlaying) {
      stopStream()
    } else if (stream) {
      startStream(streamId, stream.name)
    }
  }

  if (error || isLoading || !stream) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 ${className}`}
    >
      {isStreamPlaying ? (
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
      <span>{children || (isStreamPlaying ? 'Stop' : 'Play')}</span>
    </button>
  )
}
