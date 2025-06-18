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

  useEffect(() => {
    return () => {
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
      navigator.mediaSession.metadata = new MediaMetadata({
        ...playerMeta,
        artwork: [{
          src: '/logo.jpg', sizes: '512x512', type: 'image/jpg'
        }],
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
      
      console.log('🎵 Analyser and data array refs set:', {
        hasAnalyser: !!analyserRef.current,
        hasDataArray: !!dataArrayRef.current,
        bufferLength
      })
      
      // Set the state to trigger re-renders in components
      setVisualizationReady(true)
      
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    } catch (error) {
      console.warn('Audio visualization not supported:', error)
    }
  }

  const startStream = async (streamId: number, streamName: string) => {
    console.log('🎵 Starting stream:', streamId, streamName)
    
    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.detachAudioElement()
    }

    setIsPlaying(true)
    setCurrentStreamId(streamId)
    setCurrentStreamName(streamName)
    
    console.log('🎵 Audio context state updated - isPlaying:', true, 'streamId:', streamId)
    
    localStorage.setItem('lastPlayedStream', streamId.toString())
    
    try {
      // Dynamically import the player to avoid SSR issues
      const { default: IcecastMetadataPlayer } = await import('icecast-metadata-player')
      
      let player = new IcecastMetadataPlayer(`/streams/${streamName}`, {
        onMetadata,
        metadataTypes: ["icy"],
      }) as IcecastMetadataPlayer
      
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler('pause', stopStream)
        navigator.mediaSession.setActionHandler('stop', stopStream)
        navigator.mediaSession.setActionHandler('play', () => startStream(streamId, streamName))
      }
      
      await player.play()
      playerRef.current = player
      
      console.log('🎵 Player created and playing')
      
      // Set initial volume
      player.audioElement.volume = volume / VOLUME_INCREMENTS
      
      // Set up audio visualization
      setTimeout(() => {
        setupVisualization(player.audioElement)
        console.log('🎵 Visualization setup complete')
      }, 100)
    } catch (error) {
      console.error('Failed to load audio player:', error)
      setIsPlaying(false)
      setCurrentStreamId(null)
      setCurrentStreamName(null)
    }
  }

  const stopStream = () => {
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
