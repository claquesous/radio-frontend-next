'use client'

import React from 'react'
import Link from 'next/link'

import { Chooser, Song } from '../app/_types/types'

interface ChooserCardProps {
  chooser: Chooser
  streamId: number
}

export default function ChooserCard({ chooser, streamId }: ChooserCardProps) {
  const handleRequest = async () => {
    // TODO: Send request to API to request this song for the stream
    console.log(`Requesting song ${chooser.song.title} (ID: ${chooser.song.id}) for stream ${streamId}`)
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      alert(`Song "${chooser.song.title}" requested successfully!`)
    } catch (error) {
      console.error('Failed to request song', error)
      alert('Failed to request song.')
    }
  }

  return (
    <div id={`chooser_${chooser.id}`} className="chooser-card">
      <p>
        <strong>Song:</strong>
        <Link href={`/admin/songs/${chooser.song.id}`}>{chooser.song.title}</Link>
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
        <button onClick={handleRequest}>Request</button>
      </div>
    </div>
  )
}
