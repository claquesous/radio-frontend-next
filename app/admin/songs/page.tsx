'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Song } from '../../_types/types'
import api from '../../../lib/api'

export default function SongsIndexPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get<Song[]>('/songs')
        setSongs(response.data)
        setNotice('Songs loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch songs', error)
        setNotice('Failed to load songs.')
      }
    }
    fetchSongs()
  }, [])

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing Songs</h1>

      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Artist</th>
            <th>Artist Name Override</th>
            <th>Title</th>
            <th>Sort</th>
            <th>Slug</th>
            <th>Track</th>
            <th>Time</th>
            <th>Live</th>
            <th>Remix</th>
            <th>Year</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.album ? <Link href={`/admin/albums/${song.album.id}`}>{song.album.title}</Link> : 'N/A'}</td>
              <td><Link href={`/admin/artists/${song.artist.id}`}>{song.artist.name}</Link></td>
              <td>{song.artist_name_override}</td>
              <td>{song.title}</td>
              <td>{song.sort}</td>
              <td>{song.slug}</td>
              <td>{song.track}</td>
              <td>{song.time}</td>
              <td>{song.live ? 'Yes' : 'No'}</td>
              <td>{song.remix ? 'Yes' : 'No'}</td>
              <td>{song.year}</td>
              <td><Link href={`/admin/songs/${song.id}`}>Show</Link></td>
              <td><Link href={`/admin/songs/${song.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link href="/admin/songs/new" className="btn">New Song</Link>
    </div>
  )
}
