'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StreamCard from '../../_components/StreamCard'
import { Stream } from '../../../_types/types'
import api from '../../../../lib/api'

export default function StreamShowPage() {
  const { id } = useParams()
  const [stream, setStream] = useState<Stream | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchStream = async () => {
        try {
          const response = await api.get<Stream>(`/streams/${id}`)
          setStream(response.data)
          setNotice(`Stream ${id} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch stream ${id}`, error)
          setNotice(`Failed to load stream ${id}.`)
        }
      }
      fetchStream()
    }
  }, [id])

  if (!stream) {
    return <div>Loading stream...</div>
  }

  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}
      <StreamCard stream={stream} />
      <br />
      <Link href={`/admin/streams/${stream.id}/edit`}>Edit</Link> |{' '}
      <Link href="/admin/streams">Back</Link>
    </div>
  )
}
