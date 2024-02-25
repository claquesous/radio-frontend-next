import Link from 'next/link'
import Rating from '../../rating'
import PlayStats from '../../playstats'

async function getSong(id) {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + `/songs/${id}`, { next: { revalidate: 14400 } })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page({ params }: { params: { id: integer } }) {
  const { id } = params
  const song = await getSong(id)

  return (<>
    {song.title} by <Link href={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
    <Rating rating={song.rating} />
    <PlayStats params={song} />
  </>)
}

