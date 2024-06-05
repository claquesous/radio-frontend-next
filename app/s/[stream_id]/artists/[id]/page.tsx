import { Fragment } from 'react'
import Link from 'next/link'
import Rating from '../../../../_components/rating'
import PlayStats from '../../../../_components/playstats'
import { Song } from '../../../../_types/types'

async function getArtist(stream_id: number, id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `streams/${stream_id}/artists/${id}`, { next: { revalidate: 7200 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { stream_id: number, id: number } }) {
  const { stream_id, id } = params
  const artist = await getArtist(stream_id, id)

  return (<>
    {artist.name}
    <div className="grid grid-cols-2">
      { artist.songs.map((song: Song) =>
        <Fragment key={song.id}>
          <Link className="py-7 pl-3"
            href={`/stations/${stream_id}/songs/${song.id}`}>{song.title}
          </Link>
          <Rating rating={song.rating} />
        </Fragment>
      ) }
    </div>
    <PlayStats playStats={artist} />
  </>)
}

