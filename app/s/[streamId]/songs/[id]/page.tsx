import Link from 'next/link'
import Rating from '../../_components/rating'
import PlayStats from '../../_components/playstats'
import Enqueue from '../../_components/enqueue'

async function getSong(streamId: number, id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function SongPage({ params }: { params: { streamId: number, id: number } }) {
  const { streamId, id } = params
  const song = await getSong(streamId, id)

  return (<>
    {song.title} by <Link href={`/s/${streamId}/artists/${song.artist.id}`}>{song.artist.name}</Link>
    <Enqueue
      streamId={streamId}
      songId={id}
    />
    <Rating rating={song.rating} />
    <PlayStats playStats={song} />
  </>)
}

