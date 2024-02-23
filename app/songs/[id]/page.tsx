import Link from 'next/link'
import Rating from '../../rating'
import TimeAgo from '../../timeago'

async function getSong(id) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { id: integer } }) {
  const { id } = params
  const song = await getSong(id)

  return (<>
    {song.title} by <Link href={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
    <Rating rating={song.rating} />
    <div className="w-80 shadow rounded">
      <p>Totals Plays: {song.play_count}</p>
      <p>Last Played: <TimeAgo date={song.last_played_at} /></p>
      <p>Previously Played: <TimeAgo date={song.previous_played_at} /></p>
      <p>Last Week Rank: {song.last_week_rank}</p>
      <p>All Time Rank: {song.rank}</p>
    </div>
  </>)
}

