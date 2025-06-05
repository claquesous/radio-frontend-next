'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Play } from '../../../_types/types'
import api from '../../../../lib/api'

export default function PlayShowPage() {
  const { id } = useParams()
  const [play, setPlay] = useState<Play | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchPlay = async () => {
        try {
          const response = await api.get<Play>(`/plays/${id}`)
          setPlay(response.data)
          setNotice(`Play ${id} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch play ${id}`, error)
          setNotice(`Failed to load play ${id}.`)
        }
      }
      fetchPlay()
    }
  }, [id])

  if (!play) {
    return <div>Loading play...</div>
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <p>
        <strong>Song:</strong>
        <Link href={`/admin/songs/${play.song.id}`}>{play.song.title}</Link>
      </p>

      <p>
        <strong>Artist:</strong>
        <Link href={`/admin/artists/${play.artist.id}`}>{play.artist.name}</Link>
      </p>

      <p>
        <strong>Stream:</strong>
        <Link href={`/admin/streams/${play.stream.id}`}>{play.stream.name}</Link>
      </p>

      <p>
        <strong>Ratings:</strong>
        {play.ratings_count}
      </p>

      <p>
        <strong>Playtime:</strong>
        {play.playtime}
      </p>

      <p>
        <strong>Tweet ID:</strong>
        {play.tweet_id}
      </p>

      <Link href="/admin/plays">Back</Link>
    </div>
  )
}
