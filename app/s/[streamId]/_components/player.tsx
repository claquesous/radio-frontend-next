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
  }

  const stopStream = () => {
    setIsPlaying(false)
    setCanVote(false)
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
