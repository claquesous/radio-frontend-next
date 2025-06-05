'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SongForm from '../../_components/SongForm'
import { Song } from '../../../_types/types'
import api from '../../../../lib/api'

export default function NewSongPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (formData: any) => {
    try {
      // Send POST request to API to create new song
      const response = await api.post<Song>('/songs', formData)
      router.push(`/admin/songs/${response.data.id}`) // Redirect to song show page after creation
    } catch (error: any) {
      console.error('Failed to create song', error)
      setErrors([error.message || 'Failed to create song'])
    }
  }

  return (
    <div>
      <h1>New Song</h1>

      <SongForm onSubmit={handleSubmit} errors={errors} />

      <br />

      <Link href="/admin/songs">Back</Link>
    </div>
  )
}
