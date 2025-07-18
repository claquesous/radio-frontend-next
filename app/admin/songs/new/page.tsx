'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../../../_components/back-button'
import api from '../../../../lib/api'

interface SongResponse {
  id: number
}

export default function NewSongPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    if (!file) {
      setErrors(['Please select a file to upload'])
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('song[file]', file)
    try {
      const response = await api.post<SongResponse>('/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const data = response.data as SongResponse
      if (data && typeof data.id === 'number') {
        router.push(`/admin/songs/${data.id}`)
      } else {
        setErrors(['Upload succeeded but no song ID returned'])
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors([error.response.data.error])
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors([error.message || 'Failed to upload song'])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Upload New Song</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex items-center gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          <BackButton href="/admin/songs" />
        </div>
      </form>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <ul>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

    </div>
  )
}
