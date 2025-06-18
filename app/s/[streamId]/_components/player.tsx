'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Stream } from '../../../_types/types'
import IcecastMetadataPlayer from 'icecast-metadata-player'
import LoveIt from './love-it'
import HateIt from './hate-it'

const VOLUME_INCREMENTS = 10

interface IcyMetadata {
  StreamTitle?: string
}

interface SessionMeta {
  title: string,
  artist?: string,
  album?: string,
}

interface NowPlayingMeta {
  id: number,
  title: string,
  artist: string,
  album?: string,
  song_id: number,
  artist_id: number,
}

interface ParsedMetadata {
  id: number,
  song : {
    id: number,
    title: string,
    album?: {
      title: string,
    },
  },
  artist: {
    id: number,
    name: string,
  }
}

function getStreams(url : string) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Fetch failed')
      }
      return res.json()
    })
}

export default function Player(props: { streamId: number }) {
  const { streamId } = props
  const { data: stream, error, isLoading, isValidating } = useSWR(`/api/streams/${streamId}`, getStreams, {
    revalidateOnFocus: false
  })

  const [nowPlaying, setNowPlaying] = useState<NowPlayingMeta | string>('Press play to start the stream')
  const [canVote, setCanVote] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(VOLUME_INCREMENTS)
  const playerRef = useRef<IcecastMetadataPlayer | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  useEffect(() => stopStream, [])

  const startStream = () => {
    setIsPlaying(true)

    localStorage.setItem('lastPlayedStream', streamId.toString())
    
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
    
    // Set up audio visualization
    setTimeout(() => {
      setupVisualization(player.audioElement)
    }, 100)
  }

  const stopStream = () => {
    setIsPlaying(false)
    setCanVote(false)
    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.detachAudioElement()
    }
    
    // Clean up visualization
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
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
    let playerMeta: SessionMeta
    try {
      if (metadata.StreamTitle === undefined) {
        throw new Error('StreamTitle is undefined');
      }
      const parsedMeta: ParsedMetadata = JSON.parse(metadata.StreamTitle)
      playerMeta = {
        title: parsedMeta.song.title,
        artist: parsedMeta.artist.name,
      }
      const nowPlayingMeta: NowPlayingMeta = {
        id: parsedMeta.id,
        title: parsedMeta.song.title,
        artist: parsedMeta.artist.name,
        artist_id: parsedMeta.artist.id,
        song_id: parsedMeta.song.id,
      }
      if (!!parsedMeta.song.album) {
        playerMeta.album = parsedMeta.song.album.title
        nowPlayingMeta.album = parsedMeta.song.album.title
      }
      setNowPlaying(nowPlayingMeta)
      setCanVote(true)
    } catch (error) {
      playerMeta = {
        title: metadata?.StreamTitle || ''
      }
      setNowPlaying(playerMeta.title)
      setCanVote(false)
    }
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        ...playerMeta,
        artwork: [{
          src: '/logo.jpg', sizes: '512x512', type: 'image/jpg'
        }],
      })
    }
  }

  const setupVisualization = (audioElement: HTMLAudioElement) => {
    if (!canvasRef.current || audioContextRef.current) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContext.createMediaElementSource(audioElement)
      const analyser = audioContext.createAnalyser()
      
      analyser.fftSize = 64
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      source.connect(analyser)
      analyser.connect(audioContext.destination)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      dataArrayRef.current = dataArray
      
      startVisualization()
    } catch (error) {
      console.warn('Audio visualization not supported:', error)
    }
  }

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    const bufferLength = analyser.frequencyBinCount
    
    const draw = () => {
      if (!isPlaying) return
      
      analyser.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = canvas.width / bufferLength
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height
        
        // Create gradient colors like classic Winamp
        const intensity = dataArray[i] / 255
        let color
        if (intensity < 0.3) {
          color = `rgb(0, ${Math.floor(intensity * 255 * 3)}, 0)`
        } else if (intensity < 0.6) {
          color = `rgb(${Math.floor((intensity - 0.3) * 255 * 3)}, 255, 0)`
        } else {
          color = `rgb(255, ${Math.floor(255 - (intensity - 0.6) * 255 * 2.5)}, 0)`
        }
        
        ctx.fillStyle = color
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)
        
        x += barWidth
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    draw()
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

  function NowPlayingDisplay() {
    if (typeof nowPlaying === 'string') {
      return (<>
        <p>Now Playing:</p>
        <p>{nowPlaying}</p>
      </>)
    } else {
      return (<>
        <p>Now Playing:</p>
        <p>
          <Link href={`/s/${streamId}/artists/${nowPlaying.artist_id}`}>{nowPlaying.artist}</Link> - <Link href={`/s/${streamId}/songs/${nowPlaying.song_id}`}>{nowPlaying.title}</Link>
        </p>
      </>)
    }
  }

  return <div className="w-80 p-2 m-4 shadow rounded-lg bg-slate-200 dark:bg-slate-700 dark:text-white">
    <div>
      <h2>Current stream: <Link href={`/s/${streamId}`}>{stream?.name ?? 'None selected'}</Link></h2>
    </div>
    <NowPlayingDisplay />
    
    {/* Audio Visualization */}
    <div className="my-4 p-2 bg-black rounded border-2 border-gray-600 relative" style={{height: '80px'}}>
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full h-full"
        style={{imageRendering: 'pixelated', display: isPlaying ? 'block' : 'none'}}
      />
      {!isPlaying && (
        <div className="flex items-center justify-center h-full text-green-400 text-sm font-mono absolute inset-0">
          ⏸ VISUALIZATION STOPPED
        </div>
      )}
    </div>
    
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
      {canVote && typeof nowPlaying != 'string' && <>
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
