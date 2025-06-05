'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ChooserForm from '../../../../../../../components/ChooserForm'
import { Chooser } from '../../../../../../_types/types'
import api from '../../../../../../../lib/api'

export default function EditChooserPage() {
  const { streamId, chooserId } = useParams()
  const router = useRouter()
  const [chooser, setChooser] = useState<Chooser | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (streamId && chooserId) {
      const fetchChooser = async () => {
        try {
          const response = await api.get<Chooser>(`/streams/${streamId}/choosers/${chooserId}`)
          setChooser(response.data)
        } catch (error) {
          console.error(`Failed to fetch chooser ${chooserId} for editing`, error)
          setErrors(['Failed to load chooser for editing.'])
        }
      }
      fetchChooser()
    }
  }, [streamId, chooserId])

  const handleSubmit = async (formData: any) => {
    try {
      // Send PUT/PATCH request to API to update chooser
      await api.put(`/streams/${streamId}/choosers/${chooserId}`, formData)
      router.push(`/admin/streams/${streamId}/choosers/${chooserId}`) // Redirect to chooser show page after update
    } catch (error: any) {
      console.error(`Failed to update chooser ${chooserId}`, error)
      setErrors([error.message || 'Failed to update chooser'])
    }
  }

  if (!chooser) {
    return <div>Loading chooser data for editing...</div>
  }

  return (
    <div>
      <h1>Editing Chooser</h1>

      <ChooserForm initialData={chooser} onSubmit={handleSubmit} errors={errors} />

      <br />

      <Link href={`/admin/streams/${streamId}/choosers/${chooserId}`}>Show</Link> |{' '}
      <Link href={`/admin/streams/${streamId}/choosers`}>Back</Link>
    </div>
  )
}
