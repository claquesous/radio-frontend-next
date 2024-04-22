import Link from 'next/link'
import Rating from '../../_components/rating'
import PlayStats from '../../_components/playstats'

async function getSong(id: number) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params
  const song = await getSong(id)

  return (<>
    {song.title} by <Link href={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
    <Rating rating={song.rating} />
    <PlayStats playStats={song} />
  </>)
}

