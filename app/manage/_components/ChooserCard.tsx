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
    <div id={`chooser_${chooser.id}`} className="chooser-card flex items-center gap-3 p-3">
      <Link href={`/s/${streamId}/songs/${chooser.artist.id}`} className="text-blue-600 hover:text-blue-800">
        {chooser.artist.name}
      </Link>
       -
      <Link href={`/s/${streamId}/songs/${chooser.song.id}`} className="text-blue-600 hover:text-blue-800">
        {chooser.song.title}
      </Link>
      <Enqueue streamId={streamId} songId={chooser.song.id} />
      <span className="text-gray-600">({chooser.rating.toFixed(2)})</span>
    </div>
  )
}
