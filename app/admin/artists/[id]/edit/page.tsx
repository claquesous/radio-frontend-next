'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '../../../../_components/BackButton'
import ArtistForm from '../../../_components/ArtistForm'
import { Artist } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function EditArtistPage() {
  const { id } = useParams()
  const router = useRouter()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const fetchArtist = async () => {
        try {
          const response = await api.get<Artist>(`/artists/${id}`)
          setArtist(response.data)
        } catch (error) {
          console.error(`Failed to fetch artist ${id} for editing`, error)
          setErrors(['Failed to load artist for editing.'])
        }
      }
      fetchArtist()
    }
  }, [id])

  const handleSubmit = async (formData: any) => {
    try {
      // Send PUT/PATCH request to API to update artist
      await api.put(`/artists/${id}`, formData)
      router.push(`/admin/artists/${id}`) // Redirect to artist show page after update
    } catch (error: any) {
      console.error(`Failed to update artist ${id}`, error)
      setErrors([error.message || 'Failed to update artist'])
    }
  }

  if (!artist) {
    return <div>Loading artist data for editing...</div>
  }

  return (
    <div>
      <h1>Editing Artist</h1>

      <ArtistForm initialData={artist} onSubmit={handleSubmit} errors={errors} />

      <div className="flex items-center gap-2 mt-4">
        <BackButton href={`/admin/artists/${artist.id}`} />
      </div>
    </div>
  )
}
