'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Play, Song, Artist, Stream } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function PlaysIndexPage() {
  const { streamId } = useParams()
  const [plays, setPlays] = useState<Play[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (streamId) {
      const fetchPlays = async () => {
        try {
          const response = await api.get<Play[]>(`/streams/${streamId}/plays`)
          setPlays(response.data)
          setNotice(`Plays for Stream ${streamId} loaded successfully!`)
        } catch (error) {
          console.error(`Failed to fetch plays for stream ${streamId}`, error)
          setNotice(`Failed to load plays for stream ${streamId}.`)
        }
      }
      fetchPlays()
    }
  }, [streamId])

  const handleRate = async (playId: number, up: boolean) => {
    // TODO: Send rating request to API
    console.log(`Rating play ${playId} ${up ? 'up' : 'down'} for stream ${streamId}`)
    try {
      await api.post(`/streams/${streamId}/ratings`, { play_id: playId, up })
      alert(`Play ${playId} rated ${up ? 'up' : 'down'} successfully!`)
    } catch (error) {
      console.error('Failed to rate play', error)
      alert('Failed to rate play.')
    }
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing Plays</h1>

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
          {plays.map((play, index) => (
            <tr key={play.id}>
              <td><Link href={`/admin/songs/${play.song.id}`}>{play.song.title}</Link></td>
              <td><Link href={`/admin/artists/${play.artist.id}`}>{play.artist.name}</Link></td>
              <td><Link href={`/admin/streams/${play.stream.id}`}>{play.stream.name}</Link></td>
              <td><Link href={`/admin/plays/${play.id}`}>Show</Link></td>
              {index === 0 && (
                <>
                  <td>
                    <button onClick={() => handleRate(play.id, true)}>Rate Up</button>
                  </td>
                  <td>
                    <button onClick={() => handleRate(play.id, false)}>Rate Down</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
