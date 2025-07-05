'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '../../../../_components/BackButton'
import SongForm from '../../../_components/SongForm'
import { Song } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function EditSongPage() {
  const { id } = useParams()
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const fetchSong = async () => {
        try {
          const response = await api.get<Song>(`/songs/${id}`)
          setSong(response.data)
        } catch (error) {
          console.error(`Failed to fetch song ${id} for editing`, error)
          setErrors(['Failed to load song for editing.'])
        }
      }
      fetchSong()
    }
  }, [id])

  const handleSubmit = async (formData: any) => {
    try {
      // Send PUT/PATCH request to API to update song
      await api.put(`/songs/${id}`, formData)
      router.push(`/admin/songs/${id}`) // Redirect to song show page after update
    } catch (error: any) {
      console.error(`Failed to update song ${id}`, error)
      setErrors([error.message || 'Failed to update song'])
    }
  }

  if (!song) {
    return <div>Loading song data for editing...</div>
  }

  return (
    <div>
      <h1>Editing Song</h1>

      <SongForm initialData={song} onSubmit={handleSubmit} errors={errors} />

      <div className="flex items-center gap-2 mt-4">
        <BackButton href={`/admin/songs/${song.id}`} />
      </div>
    </div>
  )
}
