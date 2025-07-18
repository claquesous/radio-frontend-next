'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StreamForm from '../../../_components/StreamForm'
import { Stream } from '../../../../_types/types'
import api from '../../../../../lib/api'

export default function EditStreamPage() {
  const { streamId } = useParams()
  const router = useRouter()
  const [stream, setStream] = useState<Stream | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (streamId) {
      const fetchStream = async () => {
        try {
          const response = await api.get<Stream>(`/streams/${streamId}`)
          setStream(response.data)
        } catch (error) {
          console.error(`Failed to fetch stream ${streamId} for editing`, error)
          setErrors(['Failed to load stream for editing.'])
        }
      }
      fetchStream()
    }
  }, [streamId])

  const handleSubmit = async (formData: any) => {
    try {
      await api.put(`/streams/${streamId}`, formData)
      router.push(`/manage/streams/${streamId}`)
    } catch (error: any) {
      console.error(`Failed to update stream ${streamId}`, error)
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

      <Link href={`/manage/streams/${stream.id}`}>Show</Link> |{' '}
      <Link href="/manage">Back</Link>
    </div>
  )
}
