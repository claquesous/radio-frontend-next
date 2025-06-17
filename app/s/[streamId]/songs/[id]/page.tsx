import PlayStats from '../../_components/playstats'
import SongItem from '../../_components/song-item'

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
    {song.title}
    <SongItem song={song} streamId={streamId} linkTo="artist" />
    <PlayStats playStats={song} />
  </>)
}
