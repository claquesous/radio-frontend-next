'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <ul>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      <br />
      <Link href="/admin/songs">Back</Link>
    </div>
  )
}
