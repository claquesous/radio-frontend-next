import Link from 'next/link'
import PlayStats from '../../_components/playstats'
import SongItem from '../../_components/song-item'
import dynamic from "next/dynamic"

const AdminEditButton = dynamic(() => import("../../../../_components/admin-edit-button"))

async function getSong(streamId: string, id: string) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/streams/${streamId}/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function SongPage({ params }: { params: Promise<{ streamId: string, id: string }> }) {
  const { streamId, id } = await params
  const song = await getSong(streamId, id)

  return (
    <div className="sm:flex sm:items-start sm:gap-4">
      <div className="sm:flex-1 min-w-0">
        <div className="relative flex items-center mb-4 pl-3">
          <Link href={`/s/${streamId}/artists/${song.artist.id}`} className="text-2xl font-bold flex-1">
            {song.artist.name}
          </Link>
          <AdminEditButton href={`/admin/songs/${id}/edit`} />
        </div>
        <SongItem song={song} streamId={Number(streamId)} linkable={false} />
      </div>
      <PlayStats playStats={song} />
    </div>
  )
}
