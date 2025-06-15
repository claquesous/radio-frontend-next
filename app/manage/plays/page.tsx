'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Play } from '../../_types/types'
import api from '../../../lib/api'

export default function PlaysIndexPage() {
  const [plays, setPlays] = useState<Play[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const response = await api.get<Play[]>('/plays')
        setPlays(response.data)
        setNotice('All Plays loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch plays', error)
        setNotice('Failed to load plays.')
      }
    }
    fetchPlays()
  }, [])

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing All Plays</h1>

      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Stream</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {plays.map((play) => (
            <tr key={play.id}>
              <td><Link href={`/admin/songs/${play.song.id}`}>{play.song.title}</Link></td>
              <td><Link href={`/admin/artists/${play.artist.id}`}>{play.artist.name}</Link></td>
              <td><Link href={`/admin/streams/${play.stream.id}`}>{play.stream.name}</Link></td>
              <td><Link href={`/admin/plays/${play.id}`}>Show</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
