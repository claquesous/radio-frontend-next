import PlayStats from '../../_components/playstats'
import SongItem from '../../_components/song-item'
import { Song } from '../../../../_types/types'
import dynamic from "next/dynamic"

const AdminEditButton = dynamic(() => import("../../../../_components/AdminEditButton"))

async function getArtist(streamId: number, id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/artists/${id}`, { next: { revalidate: 7200 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function ArtistPage({ params }: { params: Promise<{ streamId: number, id: number }> }) {
  const { streamId, id } = await params
  const artist = await getArtist(streamId, id)

  return (
    <>
      <div className="relative flex items-center mb-4 pl-3">
        <div className="text-2xl font-bold flex-1">{artist.name}</div>
        <AdminEditButton href={`/admin/artists/${id}/edit`} />
      </div>
      {artist.songs.map((song: Song) =>
        <SongItem key={song.id} song={song} streamId={streamId} />
      )}
      <PlayStats playStats={artist} />
    </>
  )
}
