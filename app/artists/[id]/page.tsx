import Link from 'next/link'
import Rating from '../../rating'
import TimeAgo from '../../timeago'

async function getArtist(id) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/artists/${id}`)

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
    <ul>
      { artist.songs.map(song =>
        <li key={song.id}>
          <Link href={`/songs/${song.id}`}>{song.title}</Link>
          <Rating rating={song.rating} />
        </li>
      ) }
    </ul>
    <div className="w-80 shadow rounded">
      <p>Totals Plays: {artist.play_count}</p>
      <p>Last Played: <TimeAgo date={artist.last_played_at} /></p>
      <p>Previously Played: <TimeAgo date={artist.previous_played_at} /></p>
      <p>Last Week Rank: {artist.last_week_rank}</p>
      <p>All Time Rank: {artist.rank}</p>
    </div>
  </>)
}

