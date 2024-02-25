import { Fragment } from 'react'
import Link from 'next/link'
import Rating from '../../rating'
import TimeAgo from '../../timeago'

async function getArtist(id) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/artists/${id}`, { next: { revalidate: 7200 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { id: integer } }) {
  const { id } = params
  const artist = await getArtist(id)

  return (<>
    {artist.name}
    <div className="grid grid-cols-2">
      { artist.songs.map(song =>
        <Fragment key={song.id}>
          <Link className="py-7 pl-3"
            href={`/songs/${song.id}`}>{song.title}
          </Link>
          <Rating rating={song.rating} />
        </Fragment>
      ) }
    </div>
    <div className="w-80 shadow rounded">
      <p>Totals Plays: {artist.play_count}</p>
      <p>Last Played: <TimeAgo date={artist.last_played_at} /></p>
      <p>Previously Played: <TimeAgo date={artist.previous_played_at} /></p>
      <p>Last Week Rank: {artist.last_week_rank}</p>
      <p>All Time Rank: {artist.rank}</p>
    </div>
  </>)
}

