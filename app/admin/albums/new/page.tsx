'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AlbumForm from '../../_components/AlbumForm'
import { Album } from '../../../_types/types'
import api from '../../../../lib/api'

export default function NewAlbumPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (formData: any) => {
    try {
      // Send POST request to API to create new album
      const response = await api.post<Album>('/albums', formData)
      router.push(`/admin/albums/${response.data.id}`) // Redirect to album show page after creation
    } catch (error: any) {
      console.error('Failed to create album', error)
      setErrors([error.message || 'Failed to create album'])
    }
  }

  return (
    <div>
      <h1>New Album</h1>

      <AlbumForm onSubmit={handleSubmit} errors={errors} />

      <br />

      <Link href="/admin/albums">Back</Link>
    </div>
  )
}
