'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Stream } from '../../../_types/types'
import IcecastMetadataPlayer from 'icecast-metadata-player'

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
  title: string,
  artist: string,
  album?: string,
  song_id: number,
  artist_id: number,
}

interface ParsedMetadata {
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

function getStreams() {
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

      return streams
    })
}

export default function Player() {
  const { data: streams, error, isLoading, isValidating } = useSWR('/api/streams', getStreams, {
    revalidateOnFocus: false
  })

  const [nowPlaying, setNowPlaying] = useState<NowPlayingMeta | string>('Press play to start the stream')
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<IcecastMetadataPlayer | null>(null)
  const [volume, setVolume] = useState(VOLUME_INCREMENTS)

  const startStream = () => {
    setIsPlaying(true)
    let player = new IcecastMetadataPlayer(`/streams/${streams[0].name}`, {
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
    } catch (error) {
      playerMeta = {
        title: metadata?.StreamTitle || ''
      }
      setNowPlaying(playerMeta.title)
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
          <Link href={`/s/${streams[0].id}/artists/${nowPlaying.artist_id}`}>{nowPlaying.artist}</Link> - <Link href={`/s/${streams[0].id}/songs/${nowPlaying.song_id}`}>{nowPlaying.title}</Link>
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Like-1--Streamline-Core" height="24" width="24"><desc>Like 1 Streamline Icon: https://streamlinehq.com</desc><g id="like-1--reward-social-up-rating-media-like-thumb-hand"><path id="Union" fill="#000000" fill-rule="evenodd" d="M7.56126857142857 22.219542857142855c0.5759485714285714 0.27445714285714284 1.2058971428571428 0.4169142857142857 1.84392 0.4169142857142857l9.16464 0c2.111485714285714 0 3.908228571428571 -1.5377142857142856 4.234285714285714 -3.6236571428571427l1.0729714285714285 -6.862782857142856c0.3250285714285714 -2.0794285714285716 -1.2828 -3.9581485714285716 -3.387428571428571 -3.9581485714285716l-5.629268571428571 0 0 -4.041634285714285c0 -1.538742857142857 -1.2474 -2.7861394285714285 -2.786142857142857 -2.7861394285714285 -1.0085142857142857 0 -1.9383085714285713 0.5450022857142857 -2.4310114285714284 1.4249794285714286L6.0820799999999995 9.149194285714286c-0.21492 0.3838285714285714 -0.32777142857142855 0.81636 -0.32777142857142855 1.2562628571428571l0 9.329914285714285c0 0.9913714285714286 0.5700342857142856 1.8946285714285713 1.46508 2.321142857142857l0.34187999999999996 0.16302857142857144ZM1.78908 9.46332c-0.4530017142857143 0 -0.8874479999999999 0.1799485714285714 -1.2077674285714286 0.5002628571428571 -0.32031942857142853 0.32033142857142854 -0.5002736571428571 0.7547657142857143 -0.5002736571428571 1.207765714285714l8.5714285714286e-7 8.764422857142858c0 0.4530857142857142 0.17995337142857143 0.8874857142857143 0.5002728 1.2078857142857142 0.32031771428571426 0.3202285714285714 0.7547639999999999 0.5002285714285714 1.2077674285714286 0.5002285714285714l0.00035999999999999997 0 0.8509028571428572 -0.00034285714285714285c0.4732457142857143 -0.00017142857142857143 0.8567657142857142 -0.384 0.8567657142857142 -0.8571428571428571l0 -10.466297142857142c0 -0.22739999999999996 -0.09036 -0.44547428571428566 -0.2511771428571429 -0.6062228571428571 -0.1608342857142857 -0.1607657142857143 -0.37894285714285714 -0.25102285714285716 -0.6063257142857142 -0.25092l-0.8505257142857143 0.00035999999999999997Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Like-1--Streamline-Core" height="24" width="24"><desc>Like 1 Streamline Icon: https://streamlinehq.com</desc><g id="like-1--reward-social-up-rating-media-like-thumb-hand" transform="rotate(180, 12, 12)"><path id="Union" fill="#000000" fill-rule="evenodd" d="M7.56126857142857 22.219542857142855c0.5759485714285714 0.27445714285714284 1.2058971428571428 0.4169142857142857 1.84392 0.4169142857142857l9.16464 0c2.111485714285714 0 3.908228571428571 -1.5377142857142856 4.234285714285714 -3.6236571428571427l1.0729714285714285 -6.862782857142856c0.3250285714285714 -2.0794285714285716 -1.2828 -3.9581485714285716 -3.387428571428571 -3.9581485714285716l-5.629268571428571 0 0 -4.041634285714285c0 -1.538742857142857 -1.2474 -2.7861394285714285 -2.786142857142857 -2.7861394285714285 -1.0085142857142857 0 -1.9383085714285713 0.5450022857142857 -2.4310114285714284 1.4249794285714286L6.0820799999999995 9.149194285714286c-0.21492 0.3838285714285714 -0.32777142857142855 0.81636 -0.32777142857142855 1.2562628571428571l0 9.329914285714285c0 0.9913714285714286 0.5700342857142856 1.8946285714285713 1.46508 2.321142857142857l0.34187999999999996 0.16302857142857144ZM1.78908 9.46332c-0.4530017142857143 0 -0.8874479999999999 0.1799485714285714 -1.2077674285714286 0.5002628571428571 -0.32031942857142853 0.32033142857142854 -0.5002736571428571 0.7547657142857143 -0.5002736571428571 1.207765714285714l8.5714285714286e-7 8.764422857142858c0 0.4530857142857142 0.17995337142857143 0.8874857142857143 0.5002728 1.2078857142857142 0.32031771428571426 0.3202285714285714 0.7547639999999999 0.5002285714285714 1.2077674285714286 0.5002285714285714l0.00035999999999999997 0 0.8509028571428572 -0.00034285714285714285c0.4732457142857143 -0.00017142857142857143 0.8567657142857142 -0.384 0.8567657142857142 -0.8571428571428571l0 -10.466297142857142c0 -0.22739999999999996 -0.09036 -0.44547428571428566 -0.2511771428571429 -0.6062228571428571 -0.1608342857142857 -0.1607657142857143 -0.37894285714285714 -0.25102285714285716 -0.6063257142857142 -0.25092l-0.8505257142857143 0.00035999999999999997Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>
      </>)
    }
  }

  return <div className="w-80 p-2 m-4 shadow rounded-lg bg-slate-200">
    <div>
      <h2>Current stream: {streams[0]?.name ?? 'None selected'}</h2>
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

