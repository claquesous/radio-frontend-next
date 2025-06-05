'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StreamForm from '../../../_components/StreamForm'
import { Stream } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function EditStreamPage() {
  const { id } = useParams()
  const router = useRouter()
  const [stream, setStream] = useState<Stream | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const fetchStream = async () => {
        try {
          const response = await api.get<Stream>(`/streams/${id}`)
          setStream(response.data)
        } catch (error) {
          console.error(`Failed to fetch stream ${id} for editing`, error)
          setErrors(['Failed to load stream for editing.'])
        }
      }
      fetchStream()
    }
  }, [id])

  const handleSubmit = async (formData: any) => {
    try {
      // Send PUT/PATCH request to API to update stream
      await api.put(`/streams/${id}`, formData)
      router.push(`/admin/streams/${id}`) // Redirect to stream show page after update
    } catch (error: any) {
      console.error(`Failed to update stream ${id}`, error)
      setErrors([error.message || 'Failed to update stream'])
    }
  }

  if (!stream) {
    return <div>Loading stream data for editing...</div>
  }

  return (
    <div>
      <h1>Editing Stream</h1>

      <StreamForm initialData={stream} onSubmit={handleSubmit} errors={errors} />

      <br />

      <Link href={`/admin/streams/${stream.id}`}>Show</Link> |{' '}
      <Link href="/admin/streams">Back</Link>
    </div>
  )
}
