'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Play, Song, Artist, Stream } from '../../../../_types/types'
import api from '../../../../../lib/api'
import LoveIt from '../../../../_components/love-it'
import HateIt from '../../../../_components/hate-it'

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
              <td><Link href={`/s/${streamId}/songs/${play.song.id}`}>{play.song.title}</Link></td>
              <td><Link href={`/s/${streamId}/artists/${play.artist.id}`}>{play.artist.name}</Link></td>
              <td><Link href={`/manage/streams/${streamId}/plays/${play.id}`}>Show</Link></td>
              {index === 0 && (
                <>
                  <td>
                    <LoveIt streamId={Number(streamId)} playId={play.id} />
                  </td>
                  <td>
                    <HateIt streamId={Number(streamId)} playId={play.id} />
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
