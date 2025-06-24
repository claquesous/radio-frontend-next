'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StreamCard from '../../_components/StreamCard'
import { Stream } from '../../../_types/types'
import api from '../../../../lib/api'

export default function StreamShowPage() {
  const { streamId } = useParams()
  const [stream, setStream] = useState<Stream | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId) {
      const fetchStream = async () => {
        try {
          const response = await api.get<Stream>(`/streams/${streamId}`)
          setStream(response.data)
          setNotice(`Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch stream ${streamId}`, error)
          setNotice(`Failed to load stream ${streamId}.`)
        }
      }
      fetchStream()
    }
  }, [streamId])

  if (!stream) {
    return <div>Loading stream...</div>
  }

  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}
      <StreamCard stream={stream} />
      <br />
      <Link href="/manage">Back</Link>
    </div>
  )
}
