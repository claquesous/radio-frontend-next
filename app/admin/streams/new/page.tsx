'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StreamForm from '../../_components/StreamForm'
import { Stream } from '../../../_types/types'
import api from '../../../../lib/api'

export default function NewStreamPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (formData: any) => {
    try {
      // Send POST request to API to create new stream
      const response = await api.post<Stream>('/streams', formData)
      router.push(`/admin/streams/${response.data.id}`) // Redirect to stream show page after creation
    } catch (error: any) {
      console.error('Failed to create stream', error)
      setErrors([error.message || 'Failed to create stream'])
    }
  }

  return (
    <div>
      <h1>New Stream</h1>

      <StreamForm onSubmit={handleSubmit} errors={errors} />

      <br />

      <Link href="/admin/streams">Back</Link>
    </div>
  )
}
