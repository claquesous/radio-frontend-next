'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Request } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function RequestsIndexPage() {
  const { streamId } = useParams()
  const [requests, setRequests] = useState<Request[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId) {
      const fetchRequests = async () => {
        try {
          const response = await api.get<Request[]>(`/streams/${streamId}/requests`)
          setRequests(response.data)
          setNotice(`Requests for Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch requests for stream ${streamId}`, error)
          setNotice(`Failed to load requests for stream ${streamId}.`)
        }
      }
      fetchRequests()
    }
  }, [streamId])

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Requests for Stream {streamId}</h1>

      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Requested at</th>
            <th>Played</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>
                <Link href={`/admin/songs/${request.song.id}`}>{request.song.title}</Link>
              </td>
              <td>{request.requested_at}</td>
              <td>{request.played ? 'Yes' : 'No'}</td>
              <td>
                <Link href={`/admin/streams/${streamId}/requests/${request.id}`}>Show</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
