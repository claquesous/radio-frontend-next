'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Artist } from '../../../_types/types'
import api from '../../../../lib/api'
import TrashCanIcon from '../../../_components/TrashCanIcon'
import PencilEditButton from '../../../_components/pencil-edit-button'
import BackButton from '../../../_components/BackButton'

export default function ArtistShowPage() {
  const { id } = useParams()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchArtist = async () => {
        try {
          const response = await api.get<Artist>(`/artists/${id}`)
          setArtist(response.data)
          setNotice(`Artist ${id} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch artist ${id}`, error)
          setNotice(`Failed to load artist ${id}.`)
        }
      }
      fetchArtist()
    }
  }, [id])

  if (!artist) {
    return <div>Loading artist...</div>
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <p>
        <strong>Name:</strong> {artist.name}
      </p>

      <p>
        <strong>Sort:</strong> {artist.sort}
      </p>

      <p>
        <strong>Slug:</strong> {artist.slug}
      </p>

      {artist.albums && artist.albums.length > 0 && (
        <div>
          <strong>Albums:</strong>
          <ul>
            {artist.albums.map((album: { id: number, title: string }) => (
              <li key={album.id}>
                <Link href={`/admin/albums/${album.id}`} className="hover:underline">
                  {album.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {artist.songs && artist.songs.length > 0 && (
        <div>
          <strong>Songs:</strong>
          <ul>
            {artist.songs.map((song: { id: number, title: string }) => (
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
        <PencilEditButton href={`/admin/artists/${artist.id}/edit`} />
        <button
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this artist?')) return;
            try {
              await api.delete(`/artists/${artist.id}`)
              window.location.href = '/admin/artists'
            } catch (error: any) {
              setNotice(error?.response?.data?.errors?.[0] || 'Failed to delete artist.')
            }
          }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
          title="Delete artist"
        >
          <TrashCanIcon />
        </button>
        <BackButton href="/admin/artists" />
      </div>
    </div>
  )
}
