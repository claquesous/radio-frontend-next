'use client'

import React, { useState, useEffect } from 'react'

import { Chooser, ChooserFormData } from '../../_types/types'

interface ChooserFormProps {
  initialData?: ChooserFormData
  onSubmit: (data: ChooserFormData) => void
  errors?: string[]
}

export default function ChooserForm({ initialData, onSubmit, errors }: ChooserFormProps) {
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [rating, setRating] = useState(initialData?.rating || 0)

  useEffect(() => {
    if (initialData) {
      setFeatured(initialData.featured)
      setRating(initialData.rating)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ featured, rating })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <h2>{errors.length} error{errors.length > 1 ? 's' : ''} prohibited this chooser from being saved:</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="featured" style={{ display: 'block' }}>Featured</label>
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
      </div>

      <div>
        <label htmlFor="rating" style={{ display: 'block' }}>Rating</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
