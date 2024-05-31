'use client'
import useSWR from 'swr'
import { Stream } from '../_types/types'

function getStream() {
  return fetch('/api/streams')
    .then(res => {
      if (!res.ok) {
        throw new Error('Fetch failed')
      }
      return res.json()
    })
    .then(streams => {
      if (streams.length==0) {
        throw new Error('No streams found')
      }

      return streams[0]
    })
}

export default function Player() {
  const { data: stream, error, isLoading, isValidating } = useSWR('/api/streams', getStream, {
    revalidateOnFocus: false
  })

  if (error || isLoading || isValidating) {
    return <div />
  }

  return <div className="pt-16">
    <audio src={`/streams/${stream.name}`} controls preload="none"></audio>
  </div>

}

