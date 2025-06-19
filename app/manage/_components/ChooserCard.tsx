'use client'

import React from 'react'
import Link from 'next/link'

import { Chooser } from '../../_types/types'

interface ChooserCardProps {
  chooser: Chooser
  streamId: number
}

export default function ChooserCard({ chooser, streamId }: ChooserCardProps) {
  return (
    <div id={`chooser_${chooser.id}`} className="chooser-card flex items-center gap-3 p-3">
      <Link href={`/s/${streamId}/artists/${chooser.artist.id}`} className="text-blue-600 hover:text-blue-800">
        {chooser.artist.name}
      </Link>
       -
      <Link href={`/s/${streamId}/songs/${chooser.song.id}`} className="text-blue-600 hover:text-blue-800">
        {chooser.song.title}
      </Link>
      <span className="text-gray-600">({chooser.rating.toFixed(2)})</span>
    </div>
  )
}
