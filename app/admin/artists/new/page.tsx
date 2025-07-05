'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../../../_components/BackButton'
import ArtistForm from '../../_components/ArtistForm'
import { Artist } from '../../../_types/types'
import api from '../../../../lib/api'

export default function NewArtistPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (formData: any) => {
    try {
      // Send POST request to API to create new artist
      const response = await api.post<Artist>('/artists', formData)
      router.push(`/admin/artists/${response.data.id}`) // Redirect to artist show page after creation
    } catch (error: any) {
      console.error('Failed to create artist', error)
      setErrors([error.message || 'Failed to create artist'])
    }
  }

  return (
    <div>
      <h1>New Artist</h1>

      <ArtistForm onSubmit={handleSubmit} errors={errors} />

      <div className="flex items-center gap-2 mt-4">
        <BackButton href="/admin/artists" />
      </div>
    </div>
  )
}
