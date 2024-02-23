import Link from 'next/link'

async function getPlays() {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + '/plays')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const plays = await getPlays()

  return (<>
    <ul>{ plays.map(play =>
      <li key={play.id}>
        <Link href={`/artists/${play.artist.id}`}>{play.artist.name}</Link> - <Link href={`/songs/${play.song.id}`}>{play.song.title}</Link>
      </li>
    ) }</ul>
  </>)
}

