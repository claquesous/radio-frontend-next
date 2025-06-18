'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ChooserCard from '../../../_components/ChooserCard'

import { Chooser, Song } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function ChoosersIndexPage() {
  const { streamId } = useParams()
  const [choosers, setChoosers] = useState<Chooser[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId) {
      const fetchChoosers = async () => {
        try {
          const response = await api.get<Chooser[]>(`/streams/${streamId}/choosers`)
          setChoosers(response.data)
          setNotice(`Choosers for Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch choosers for stream ${streamId}`, error)
          setNotice(`Failed to load choosers for stream ${streamId}.`)
        }
      }
      fetchChoosers()
    }
  }, [streamId])

  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}

      <h1>Choosers for Stream {streamId}</h1>

      <div id="choosers">
        {choosers.map((chooser) => (
          <div key={chooser.id}>
            <ChooserCard chooser={chooser} streamId={Number(streamId)} />
            <p>
              <Link href={`/manage/streams/${streamId}/choosers/${chooser.id}`}>Show this chooser</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
