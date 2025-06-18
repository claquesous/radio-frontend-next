'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Request, Song } from '../../../../../_types/types'
import api from '../../../../../../lib/api'

export default function RequestShowPage() {
  const { streamId, requestId } = useParams()
  const [request, setRequest] = useState<Request | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId && requestId) {
      const fetchRequest = async () => {
        try {
          const response = await api.get<Request>(`/streams/${streamId}/requests/${requestId}`)
          setRequest(response.data)
          setNotice(`Request ${requestId} for Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch request ${requestId} for stream ${streamId}`, error)
          setNotice(`Failed to load request ${requestId} for stream ${streamId}.`)
        }
      }
      fetchRequest()
    }
  }, [streamId, requestId])

  if (!request) {
    return <div>Loading request...</div>
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <p>
        <strong>Song:</strong>
        <Link href={`/s/${streamId}/songs/${request.song.id}`}>{request.song.title}</Link>
      </p>

      <p>
        <strong>Requested at:</strong>
        {request.requested_at}
      </p>

      <p>
        <strong>Played:</strong>
        {request.played ? 'Yes' : 'No'}
      </p>

      <Link href={`/manage/streams/${streamId}/requests`}>Back</Link>
    </div>
  )
}
