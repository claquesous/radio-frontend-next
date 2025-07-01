import { Fragment } from 'react'
import Link from 'next/link'
import Rating from './rating'
import { Play } from '../../../_types/types'

async function getPlays(streamId: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/plays`, { next: { revalidate: 60 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Plays(props: {streamId: number}) {
  const {streamId} = props
  const plays = await getPlays(streamId)

  return <div className="grid grid-cols-3 w-full min-h-screen">{ plays.map((play: Play) =>
    <div key={play.id} className="contents">
      <Link className="py-7 pl-3"
        href={`/s/${streamId}/artists/${play.artist.id}`}>{play.artist.name}
      </Link>
      <Link className="py-7"
        href={`/s/${streamId}/songs/${play.song.id}`}>{play.song.title}
      </Link>
      <Rating rating={play.song.rating} />
    </div>
  ) }</div>
}
