'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Album } from '../../../_types/types'
import api from '../../../../lib/api'
import DeleteButton from '../../../_components/delete-button'
import EditButton from '../../../_components/edit-button'
import BackButton from '../../../_components/back-button'

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
        <Link href={`/admin/artists/${album.artist.id}`} className="hover:underline">{album.artist.name}</Link>
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

      {album.songs && album.songs.length > 0 && (
        <div>
          <strong>Songs:</strong>
          <ul>
            {album.songs.map((song: { id: number, title: string }) => (
              <li key={song.id}>
                <Link href={`/admin/songs/${song.id}`} className="hover:underline">
                  {song.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <EditButton href={`/admin/albums/${album.id}/edit`} />
        <DeleteButton
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this album?')) return;
            try {
              await api.delete(`/albums/${album.id}`)
              window.location.href = '/admin/albums'
            } catch (error: any) {
              setNotice(error?.response?.data?.errors?.[0] || 'Failed to delete album.')
            }
          }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
          title="Delete album"
        />
        <BackButton href="/admin/albums" />
      </div>
    </div>
  )
}
