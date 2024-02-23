import Link from 'next/link'
import Rating from '../rating'

async function getPlays() {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + '/plays', { next: { revalidate: 60 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Plays() {
  const plays = await getPlays()

  return (<>
    <ul>{ plays.map(play =>
      <li key={play.id}>
        <Link href={`/artists/${play.artist.id}`}>{play.artist.name}</Link> - <Link href={`/songs/${play.song.id}`}>{play.song.title}</Link>
        <Rating rating={play.song.rating} />
      </li>
    ) }</ul>
  </>)
}

