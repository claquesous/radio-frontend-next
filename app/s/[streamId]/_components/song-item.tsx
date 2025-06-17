import Link from 'next/link'
import dynamic from 'next/dynamic'
const DynamicRating = dynamic(() => import('./rating'))
import Enqueue from './enqueue'
import { Song } from '../../../_types/types'

interface SongItemProps {
  song: Song
  streamId: number
  linkable?: boolean
}

export default function SongItem({ song, streamId, linkable = true }: SongItemProps) {
  const songTitleElement = linkable ? (
    <Link className="py-7 pl-3" href={`/s/${streamId}/songs/${song.id}`}>{song.title}</Link>
  ) : (
    <span className="py-7 pl-3">{song.title}</span>
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
