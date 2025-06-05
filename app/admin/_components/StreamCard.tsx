import React from 'react'

import { Stream } from '../app/_types/types'

interface StreamCardProps {
  stream: Stream
}

export default function StreamCard({ stream }: StreamCardProps) {
  return (
    <div className="stream-card">
      <h3>{stream.name}</h3>
      {/* Add more stream details here if needed */}
    </div>
  )
}
