'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Album } from '../../_types/types'
import api from '../../../lib/api'

export default function AlbumsIndexPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get<Album[]>('/albums')
        setAlbums(response.data)
        setNotice('Albums loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch albums', error)
        setNotice('Failed to load albums.')
      }
    }
    fetchAlbums()
  }, [])

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing Albums</h1>

      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Title</th>
            <th>Sort</th>
            <th>Slug</th>
            <th>Tracks</th>
            <th>Id3 genre</th>
            <th>Record label</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {albums.map((album) => (
            <tr key={album.id}>
              <td><Link href={`/admin/artists/${album.artist.id}`}>{album.artist.name}</Link></td>
              <td>{album.title}</td>
              <td>{album.sort}</td>
              <td>{album.slug}</td>
              <td>{album.tracks}</td>
              <td>{album.id3_genre}</td>
              <td>{album.record_label}</td>
              <td><Link href={`/admin/albums/${album.id}`}>Show</Link></td>
              <td><Link href={`/admin/albums/${album.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link href="/admin/albums/new" className="btn">New Album</Link>
    </div>
  )
}
