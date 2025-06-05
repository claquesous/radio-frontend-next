'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StreamCard from '../_components/StreamCard'

import { Stream } from '../../_types/types'
import api from '../../../lib/api' // Import the API helper

export default function StreamsIndexPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch streams from API
    const fetchStreams = async () => {
      try {
        const response = await api.get<Stream[]>('/streams')
        setStreams(response.data)
        setNotice('Streams loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch streams', error)
        setNotice('Failed to load streams.')
      }
    }
    fetchStreams()
  }, [])

  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}

      <h1>Streams</h1>

      <div id="streams">
        {streams.map((stream) => (
          <div key={stream.id}>
            <StreamCard stream={stream} />
            <p>
              <Link href={`/admin/streams/${stream.id}`}>Show this stream</Link>
            </p>
          </div>
        ))}
      </div>

      <Link href="/admin/streams/new">New stream</Link>
    </div>
  )
}
