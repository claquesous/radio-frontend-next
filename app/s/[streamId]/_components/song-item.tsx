import Link from 'next/link'
import dynamic from 'next/dynamic'
const DynamicRating = dynamic(() => import('./rating'))
import Enqueue from './enqueue'
import { Song } from '../../../_types/types'

interface SongItemProps {
  song: Song
  streamId: number
  linkTo?: 'song' | 'none'
}

export default function SongItem({ song, streamId, linkTo = 'song' }: SongItemProps) {
  const songTitleElement = linkTo === 'none' ? (
    <span className="py-7 pl-3">{song.title}</span>
  ) : (
    <Link className="py-7 pl-3" href={`/s/${streamId}/songs/${song.id}`}>{song.title}</Link>
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
