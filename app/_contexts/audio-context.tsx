'use client'
import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react'

interface IcyMetadata {
  StreamTitle?: string
}

interface SessionMeta {
  title: string,
  artist?: string,
  album?: string,
}

export interface NowPlayingMeta {
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

// Type definition for IcecastMetadataPlayer
interface IcecastMetadataPlayer {
  play(): Promise<void>
  stop(): void
  detachAudioElement(): void
  audioElement: HTMLAudioElement
}

interface AudioContextType {
  isPlaying: boolean
  volume: number
  nowPlaying: NowPlayingMeta | string
  canVote: boolean
  currentStreamId: number | null
  currentStreamName: string | null
  visualizationReady: boolean
  startStream: (streamId: number, streamName: string) => void
  stopStream: () => void
  setVolume: (volume: number) => void
  playerRef: React.RefObject<IcecastMetadataPlayer | null>
  audioContextRef: React.RefObject<AudioContext | null>
  analyserRef: React.RefObject<AnalyserNode | null>
  dataArrayRef: React.RefObject<Uint8Array | null>
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

const VOLUME_INCREMENTS = 10

// The player retries failed requests itself (e.g. Icecast 404ing the mount
// while Liquidsoap restarts), but gives up after retryTimeout, and when
// Icecast closes the connection cleanly because the source went away it just
// stops. Both end in onStop, from which we reconnect on this schedule, long
// enough to outlast the stream manager's restart backoff (up to 30s) plus
// Liquidsoap's startup.
const RETRY_TIMEOUT_SECONDS = 60
const RECONNECT_DELAYS_MS = [2000, 5000, 10000, 20000, 30000]
const MAX_RECONNECT_ATTEMPTS = 10 // ~4 minutes

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(VOLUME_INCREMENTS)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingMeta | string>('Press play to start a stream')
  const [canVote, setCanVote] = useState(false)
  const [currentStreamId, setCurrentStreamId] = useState<number | null>(null)
  const [currentStreamName, setCurrentStreamName] = useState<string | null>(null)
  const [visualizationReady, setVisualizationReady] = useState(false)

  const playerRef = useRef<IcecastMetadataPlayer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  // True from startStream until stopStream: a stop while this is set wasn't
  // asked for, so reconnect.
  const wantPlayingRef = useRef(false)
  const reconnectAttemptRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearReconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      clearReconnect()
      if (playerRef.current) {
        playerRef.current.stop()
        playerRef.current.detachAudioElement()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

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
      const absoluteLogoUrl = `${window.location.origin}/logo.jpg`
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playerMeta.title,
        artist: playerMeta.artist || currentStreamName || 'Claq Radio',
        album: playerMeta.album || currentStreamName || 'Claq Radio',
        artwork: [
          {
            src: absoluteLogoUrl,
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: absoluteLogoUrl,
            sizes: '256x256',
            type: 'image/jpeg'
          },
          {
            src: absoluteLogoUrl,
            sizes: '128x128',
            type: 'image/jpeg'
          }
        ],
      })
    }
  }

  const setupVisualization = (audioElement: HTMLAudioElement) => {
    if (audioContextRef.current) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContext.createMediaElementSource(audioElement)
      const analyser = audioContext.createAnalyser()

      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.8
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      source.connect(analyser)
      analyser.connect(audioContext.destination)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
      dataArrayRef.current = dataArray

      // Set the state to trigger re-renders in components
      setVisualizationReady(true)

      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    } catch (error) {
      console.warn('Audio visualization not supported:', error)
    }
  }

  const scheduleReconnect = (player: IcecastMetadataPlayer) => {
    const attempt = reconnectAttemptRef.current++
    if (attempt >= MAX_RECONNECT_ATTEMPTS) {
      console.warn('Giving up reconnecting to the stream')
      stopStream()
      setNowPlaying('Stream unavailable')
      return
    }
    setNowPlaying('Reconnecting…')
    setCanVote(false)
    const delay = RECONNECT_DELAYS_MS[Math.min(attempt, RECONNECT_DELAYS_MS.length - 1)]
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null
      if (playerRef.current !== player || !wantPlayingRef.current) return
      player.play().catch((error) => console.error('Reconnect failed:', error))
    }, delay)
  }

  const startStream = async (streamId: number, streamName: string) => {
    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.detachAudioElement()
      // Clear it before the old player's onStop fires, or it would reconnect.
      playerRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
      analyserRef.current = null
      dataArrayRef.current = null
      setVisualizationReady(false)
    }

    clearReconnect()
    reconnectAttemptRef.current = 0
    wantPlayingRef.current = true
    setIsPlaying(true)
    setCurrentStreamId(Number(streamId)) // Ensure it's stored as a number
    setCurrentStreamName(streamName)

    localStorage.setItem('lastPlayedStream', JSON.stringify({ id: streamId, name: streamName }))

    try {
      // Dynamically import the player to avoid SSR issues
      const { default: IcecastMetadataPlayer } = await import('icecast-metadata-player')

      const player = new IcecastMetadataPlayer(`/streams/stream-${streamId}`, {
        onMetadata,
        metadataTypes: ["icy"],
        retryTimeout: RETRY_TIMEOUT_SECONDS,
        onRetry: () => {
          setNowPlaying('Reconnecting…')
          setCanVote(false)
        },
        onStreamStart: () => {
          reconnectAttemptRef.current = 0
          setupVisualization(player.audioElement)
        },
        onStop: () => {
          // Still the current player and nobody pressed stop: the connection
          // dropped (or the player's own retries timed out), so try again.
          if (playerRef.current !== player || !wantPlayingRef.current) return
          scheduleReconnect(player)
        },
      }) as IcecastMetadataPlayer

      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler('pause', stopStream)
        navigator.mediaSession.setActionHandler('stop', stopStream)
        navigator.mediaSession.setActionHandler('play', () => startStream(streamId, streamName))
      }

      // play() resolves when audio starts, and never does if the stream can't
      // be reached, so don't wait on it for anything else.
      playerRef.current = player
      player.audioElement.volume = volume / VOLUME_INCREMENTS
      await player.play()
    } catch (error) {
      console.error('Failed to load audio player:', error)
      wantPlayingRef.current = false
      setIsPlaying(false)
      setCurrentStreamId(null)
      setCurrentStreamName(null)
    }
  }

  const stopStream = () => {
    wantPlayingRef.current = false
    clearReconnect()
    setIsPlaying(false)
    setCanVote(false)
    setCurrentStreamId(null)
    setCurrentStreamName(null)
    setVisualizationReady(false)

    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.detachAudioElement()
      playerRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    dataArrayRef.current = null
  }

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(newVolume, VOLUME_INCREMENTS))
    setVolumeState(clampedVolume)
    if (playerRef.current) {
      playerRef.current.audioElement.volume = clampedVolume / VOLUME_INCREMENTS
    }
  }

  const value: AudioContextType = {
    isPlaying,
    volume,
    nowPlaying,
    canVote,
    currentStreamId,
    currentStreamName,
    visualizationReady,
    startStream,
    stopStream,
    setVolume,
    playerRef,
    audioContextRef,
    analyserRef,
    dataArrayRef
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
