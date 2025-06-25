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
    <div id={`chooser_${chooser.id}`} className="chooser-card flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 w-full break-all">
      <div className="flex flex-row flex-wrap items-center gap-1 w-full">
        <Link href={`/s/${streamId}/artists/${chooser.artist.id}`} className="text-blue-600 hover:text-blue-800 break-all">
          {chooser.artist.name}
        </Link>
        <span className="hidden sm:inline">-</span>
        <span className="inline sm:hidden"> </span>
        <Link href={`/s/${streamId}/songs/${chooser.song.id}`} className="text-blue-600 hover:text-blue-800 break-all">
          {chooser.song.title}
        </Link>
      </div>
      <span className="text-gray-600">{chooser.rating.toFixed(2)}</span>
    </div>
  )
}
