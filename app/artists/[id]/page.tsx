import { Fragment } from 'react'
import Link from 'next/link'
import Rating from '../../_components/rating'
import PlayStats from '../../_components/playstats'
import { Song } from '../../_types/types'

async function getArtist(id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/artists/${id}`, { next: { revalidate: 7200 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params
  const artist = await getArtist(id)

  return (<>
    {artist.name}
    <div className="grid grid-cols-2">
      { artist.songs.map((song: Song) =>
        <Fragment key={song.id}>
          <Link className="py-7 pl-3"
            href={`/songs/${song.id}`}>{song.title}
          </Link>
          <Rating rating={song.rating} />
        </Fragment>
      ) }
    </div>
    <PlayStats playStats={artist} />
  </>)
}

