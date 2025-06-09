'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Artist } from '../../_types/types'
import api from '../../../lib/api'

export default function ArtistsIndexPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get<Artist[]>('/artists')
        setArtists(response.data)
        setNotice('Artists loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch artists', error)
        setNotice('Failed to load artists.')
      }
    }
    fetchArtists()
  }, [])

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing Artists</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sort</th>
            <th>Slug</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.name}</td>
              <td>{artist.sort}</td>
              <td>{artist.slug}</td>
              <td><Link href={`/admin/artists/${artist.id}`}>Show</Link></td>
              <td><Link href={`/admin/artists/${artist.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link href="/admin/artists/new" className="btn">New Artist</Link>
    </div>
  )
}
