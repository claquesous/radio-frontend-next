'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Song } from '../../../_types/types'
import api from '../../../../lib/api'

export default function SongShowPage() {
  const { id } = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchSong = async () => {
        try {
          const response = await api.get<Song>(`/songs/${id}`)
          setSong(response.data)
          setNotice(`Song ${id} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch song ${id}`, error)
          setNotice(`Failed to load song ${id}.`)
        }
      }
      fetchSong()
    }
  }, [id])

  if (!song) {
    return <div>Loading song...</div>
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <p>
        <strong>Album:</strong>
        {song.album ? <Link href={`/admin/albums/${song.album.id}`} className="hover:underline">{song.album.title}</Link> : 'N/A'}
      </p>

      <p>
        <strong>Artist:</strong>
        <Link href={`/admin/artists/${song.artist.id}`} className="hover:underline">{song.artist.name}</Link>
      </p>

      <p>
        <strong>Artist Name Override:</strong>
        {song.artist_name_override}
      </p>

      <p>
        <strong>Title:</strong>
        {song.title}
      </p>

      <p>
        <strong>Sort:</strong>
        {song.sort}
      </p>

      <p>
        <strong>Slug:</strong>
        {song.slug}
      </p>

      <p>
        <strong>Track:</strong>
        {song.track}
      </p>

      <p>
        <strong>Time:</strong>
        {song.time}
      </p>

      <p>
        <strong>Live:</strong>
        {song.live ? 'Yes' : 'No'}
      </p>

      <p>
        <strong>Remix:</strong>
        {song.remix ? 'Yes' : 'No'}
      </p>

      <p>
        <strong>Year:</strong>
        {song.year}
      </p>

      <Link href={`/admin/songs/${song.id}/edit`}>Edit</Link> |{' '}
      <Link href="/admin/songs">Back</Link>
    </div>
  )
}
