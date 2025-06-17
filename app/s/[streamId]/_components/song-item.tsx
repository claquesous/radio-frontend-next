import Link from 'next/link'
import dynamic from 'next/dynamic'
const DynamicRating = dynamic(() => import('./rating'))
import Enqueue from './enqueue'
import { Song } from '../../../_types/types'

interface SongItemProps {
  song: Song
  streamId: number
  linkTo?: 'artist' | 'song' | 'none'
}

export default function SongItem({ song, streamId, linkTo = 'song' }: SongItemProps) {
  const linkHref = linkTo === 'artist' 
    ? `/s/${streamId}/artists/${song.artist.id}`
    : `/s/${streamId}/songs/${song.id}`
  
  const songTitleElement = linkTo === 'none' ? (
    <span className="py-7 pl-3">{song.title}</span>
  ) : (
    <Link className="py-7 pl-3" href={linkHref}>{song.title}</Link>
  )

  return (
    <div className="grid grid-cols-2">
      <div>
        {songTitleElement}
        <Enqueue
          streamId={streamId}
          songId={song.id}
        />
      </div>
      <DynamicRating rating={song.rating} />
    </div>
  )
}
