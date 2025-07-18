'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AlbumForm from '../../../_components/album-form'
import { Album } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function EditAlbumPage() {
  const { id } = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<Album | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const fetchAlbum = async () => {
        try {
          const response = await api.get<Album>(`/albums/${id}`)
          setAlbum(response.data)
        } catch (error) {
          console.error(`Failed to fetch album ${id} for editing`, error)
          setErrors(['Failed to load album for editing.'])
        }
      }
      fetchAlbum()
    }
  }, [id])

  const handleSubmit = async (formData: any) => {
    try {
      // Send PUT/PATCH request to API to update album
      await api.put(`/albums/${id}`, formData)
      router.push(`/admin/albums/${id}`) // Redirect to album show page after update
    } catch (error: any) {
      console.error(`Failed to update album ${id}`, error)
      setErrors([error.message || 'Failed to update album'])
    }
  }

  if (!album) {
    return <div>Loading album data for editing...</div>
  }

  return (
    <div>
      <h1>Editing Album</h1>

      <AlbumForm initialData={album} onSubmit={handleSubmit} errors={errors} backHref={`/admin/albums/${album.id}`} />
    </div>
  )
}
