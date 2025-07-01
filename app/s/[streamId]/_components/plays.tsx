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

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col w-full">
        {plays.map((play: Play) =>
          <div key={play.id} className="flex items-center border-b border-slate-300 dark:border-slate-700 px-3 py-4 gap-4">
            <Link className="font-medium text-blue-700 dark:text-blue-300 hover:underline"
              href={`/s/${streamId}/artists/${play.artist.id}`}>{play.artist.name}
            </Link>
            <Link className="flex-1 font-semibold text-slate-900 dark:text-slate-100 hover:underline"
              href={`/s/${streamId}/songs/${play.song.id}`}>{play.song.title}
            </Link>
            <Rating rating={play.song.rating} />
          </div>
        )}
      </div>
    </div>
  )
}
