import { Fragment } from 'react'
import Link from 'next/link'
import Rating from '../../_components/rating'
import Enqueue from '../../_components/enqueue'
import PlayStats from '../../_components/playstats'
import { Song } from '../../../../_types/types'

async function getArtist(streamId: number, id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/artists/${id}`, { next: { revalidate: 7200 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function ArtistPage({ params }: { params: { streamId: number, id: number } }) {
  const { streamId, id } = params
  const artist = await getArtist(streamId, id)

  return (<>
    {artist.name}
    <div className="grid grid-cols-2">
      { artist.songs.map((song: Song) =>
        <Fragment key={song.id}>
          <div>
            <Link className="py-7 pl-3"
              href={`/s/${streamId}/songs/${song.id}`}>{song.title}
            </Link>
            <Enqueue
              streamId={streamId}
              songId={song.id}
            />
          </div>
          <Rating rating={song.rating} />
        </Fragment>
      ) }
    </div>
    <PlayStats playStats={artist} />
  </>)
}

