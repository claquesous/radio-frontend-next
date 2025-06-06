'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../../../lib/api'

export default function NewSongPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setErrors(['Please select a file to upload'])
      return
    }
    const formData = new FormData()
    formData.append('song[file]', file)
    try {
      const response = await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      router.push(`/admin/songs/${response.data.id}`)
    } catch (error: any) {
      setErrors([error.message || 'Failed to upload song'])
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
        <button type="submit">Upload</button>
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
