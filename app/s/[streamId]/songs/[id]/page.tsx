import Link from 'next/link'
import dynamic from 'next/dynamic'
const DynamicRating = dynamic(() => import('../../_components/rating'))
import PlayStats from '../../_components/playstats'
import Enqueue from '../../_components/enqueue'

async function getSong(streamId: number, id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function SongPage({ params }: { params: Promise<{ streamId: number, id: number }> }) {
  const { streamId, id } = await params
  const song = await getSong(streamId, id)

  return (<>
    {song.title} by <Link href={`/s/${streamId}/artists/${song.artist.id}`}>{song.artist.name}</Link>
    <Enqueue
      streamId={streamId}
      songId={id}
    />
    <DynamicRating rating={song.rating} />
    <PlayStats playStats={song} />
  </>)
}
