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
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="px-4 py-2 text-slate-700 dark:text-slate-200 font-semibold">Artist</th>
            <th className="px-4 py-2 text-slate-700 dark:text-slate-200 font-semibold">Song</th>
            <th className="px-4 py-2 text-slate-700 dark:text-slate-200 font-semibold">Rating</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((play: Play) =>
            <tr key={play.id} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <td className="px-4 py-2">
                <Link className="text-blue-700 dark:text-blue-300 hover:underline"
                  href={`/s/${streamId}/artists/${play.artist.id}`}>{play.artist.name}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link className="text-slate-900 dark:text-slate-100 hover:underline"
                  href={`/s/${streamId}/songs/${play.song.id}`}>{play.song.title}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Rating rating={play.song.rating} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
