import { Fragment } from 'react'
import Link from 'next/link'
import Rating from './rating'

async function getPlays() {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + '/plays', { next: { revalidate: 60 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Plays() {
  const plays = await getPlays()

  return <div className="grid grid-cols-3">{ plays.map(play =>
    <Fragment key={play.id}>
      <Link className="py-7 pl-3"
        href={`/artists/${play.artist.id}`}>{play.artist.name}
      </Link>
      <Link className="py-7"
        href={`/songs/${play.song.id}`}>{play.song.title}
      </Link>
      <Rating rating={play.song.rating} />
    </Fragment>
  ) }</div>
}

