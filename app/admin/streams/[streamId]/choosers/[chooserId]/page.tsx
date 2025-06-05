'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ChooserCard from '../../../../../../components/ChooserCard'

import { Chooser } from '../../../../../_types/types'
import api from '../../../../../../lib/api'

export default function ChooserShowPage() {
  const { streamId, chooserId } = useParams()
  const [chooser, setChooser] = useState<Chooser | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId && chooserId) {
      const fetchChooser = async () => {
        try {
          const response = await api.get<Chooser>(`/streams/${streamId}/choosers/${chooserId}`)
          setChooser(response.data)
          setNotice(`Chooser ${chooserId} for Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch chooser ${chooserId} for stream ${streamId}`, error)
          setNotice(`Failed to load chooser ${chooserId} for stream ${streamId}.`)
        }
      }
      fetchChooser()
    }
  }, [streamId, chooserId])

  if (!chooser) {
    return <div>Loading chooser...</div>
  }

  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}

      <ChooserCard chooser={chooser} streamId={Number(streamId)} />

      <br />

      <Link href={`/admin/streams/${streamId}/choosers`}>Back</Link>
    </div>
  )
}
