import { Stream } from '../_types/types'

async function getStreams() {
  const res = await fetch(process.env.RADIO_BACKEND_PATH + '/streams')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Player() {
  const [stream] = await getStreams()

  return <div className="pt-16">
    <audio src={`/streams/${stream.name}`} controls preload="none"></audio>
  </div>

}

