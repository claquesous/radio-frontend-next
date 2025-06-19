'use client'

import React from 'react'
import Link from 'next/link'
import Enqueue from '../../_components/enqueue'

import { Chooser } from '../../_types/types'

interface ChooserCardProps {
  chooser: Chooser
  streamId: number
}

export default function ChooserCard({ chooser, streamId }: ChooserCardProps) {
  return (
    <div id={`chooser_${chooser.id}`} className="chooser-card">
      <p>
        <strong>Song:</strong>
        <Link href={`/s/${streamId}/songs/${chooser.song.id}`}>{chooser.song.title}</Link>
      </p>

      <p>
        <strong>Featured:</strong>
        {chooser.featured ? 'Yes' : 'No'}
      </p>

      <p>
        <strong>Rating:</strong>
        {chooser.rating}
      </p>

      <div className="actions">
        <Enqueue streamId={streamId} songId={chooser.song.id} />
      </div>
    </div>
  )
}
