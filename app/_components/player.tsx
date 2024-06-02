'use client'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Stream } from '../_types/types'
import IcecastMetadataPlayer from 'icecast-metadata-player'

const VOLUME_INCREMENTS = 10

interface IcyMetadata {
  StreamTitle?: string
}

function getStream() {
  return fetch('/api/streams')
    .then(res => {
      if (!res.ok) {
        throw new Error('Fetch failed')
      }
      return res.json()
    })
    .then(streams => {
      if (streams.length==0) {
        throw new Error('No streams found')
      }

      return streams[0]
    })
}

export default function Player() {
  const { data: stream, error, isLoading, isValidating } = useSWR('/api/streams', getStream, {
    revalidateOnFocus: false
  })

  const [nowPlaying, setNowPlaying] = useState('Press play to start the stream')
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<IcecastMetadataPlayer | null>(null)
  const [volume, setVolume] = useState(VOLUME_INCREMENTS)

  const startStream = () => {
    setIsPlaying(true)
    let player = new IcecastMetadataPlayer(`/streams/${stream.name}`, {
      onMetadata,
      metadataTypes: ["icy"],
    })
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler('pause', stopStream)
      navigator.mediaSession.setActionHandler('stop', stopStream)
      navigator.mediaSession.setActionHandler('play', startStream)
    }
    player.play()
    playerRef.current = player
  }

  const stopStream = () => {
    setIsPlaying(false)
    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.detachAudioElement()
    }
  }

  const crankIt = () => {
    const newVolume = Math.min(volume + 1, VOLUME_INCREMENTS)
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.audioElement.volume = newVolume / VOLUME_INCREMENTS
    }
  }

  const tooLoud = () => {
    const newVolume = Math.max(volume - 1, 0)
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.audioElement.volume = newVolume / VOLUME_INCREMENTS
    }
  }

  const onMetadata = (metadata: IcyMetadata) => {
    setNowPlaying(metadata.StreamTitle ?? 'Title Unavailable')
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata.StreamTitle,
        artwork: [{
          src: '/logo.jpg', sizes: '512x512', type: 'image/jpg'
        }],
      })
    }
  }

  const getVolumeColor = (index: number) => {
    if (index>=volume) {
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

  return <div className="w-80 p-2 m-4 shadow rounded-lg bg-slate-200">
    <div>
      <h2>Current stream: {stream?.name ?? 'None selected'}</h2>
    </div>

    <p>Now Playing:</p>
    <p>{nowPlaying}</p>
    <div className="flex space-x-1">
      <button
        onClick={isPlaying ? stopStream : startStream}
        className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500"
      >
        {isPlaying ? (
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
      <button
        onClick={tooLoud}
        className="w-4 h-6 bg-gray-400 rounded-lg hover:bg-gray-500"
      >-</button>
      {[...Array(VOLUME_INCREMENTS)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-6 rounded-sm"
          style={{backgroundColor: getVolumeColor(i)}}
        ></div>
      ))}
      <button
        onClick={crankIt}
        className="w-4 h-6 bg-gray-400 rounded-lg hover:bg-gray-500"
      >+</button>
    </div>
  </div>

}

