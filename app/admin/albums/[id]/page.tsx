'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Album } from '../../../_types/types'
import api from '../../../../lib/api'

export default function AlbumShowPage() {
  const { id } = useParams()
  const [album, setAlbum] = useState<Album | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchAlbum = async () => {
        try {
          const response = await api.get<Album>(`/albums/${id}`)
          setAlbum(response.data)
          setNotice(`Album ${id} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch album ${id}`, error)
          setNotice(`Failed to load album ${id}.`)
        }
      }
      fetchAlbum()
    }
  }, [id])

  if (!album) {
    return <div>Loading album...</div>
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <p>
        <strong>Artist:</strong>
        <Link href={`/admin/artists/${album.artist.id}`}>{album.artist.name}</Link>
      </p>

      <p>
        <strong>Title:</strong>
        {album.title}
      </p>

      <p>
        <strong>Sort:</strong>
        {album.sort}
      </p>

      <p>
        <strong>Slug:</strong>
        {album.slug}
      </p>

      <p>
        <strong>Tracks:</strong>
        {album.tracks}
      </p>

      <p>
        <strong>Id3 genre:</strong>
        {album.id3_genre}
      </p>

      <p>
        <strong>Record label:</strong>
        {album.record_label}
      </p>

      <Link href={`/admin/albums/${album.id}/edit`}>Edit</Link> |{' '}
      <Link href="/admin/albums">Back</Link>
    </div>
  )
}
