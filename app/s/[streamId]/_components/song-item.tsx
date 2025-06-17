import Link from 'next/link'
import dynamic from 'next/dynamic'
const DynamicRating = dynamic(() => import('./rating'))
import Enqueue from './enqueue'
import { Song } from '../../../_types/types'

interface SongItemProps {
  song: Song
  streamId: number
  linkTo?: 'artist' | 'song'
}

export default function SongItem({ song, streamId, linkTo = 'song' }: SongItemProps) {
  const linkHref = linkTo === 'artist' 
    ? `/s/${streamId}/artists/${song.artist.id}`
    : `/s/${streamId}/songs/${song.id}`
  
  const linkText = linkTo === 'artist' ? song.artist.name : song.title

  return (
    <div className="grid grid-cols-2">
      <div>
        <Link className="py-7 pl-3"
          href={linkHref}>{song.title}
        </Link>
        <Enqueue
          streamId={streamId}
          songId={song.id}
        />
      </div>
      <DynamicRating rating={song.rating} />
    </div>
  )
}
