'use client'

import React, { useState, useEffect } from 'react'
import { Artist } from '../../_types/types'

import BackButton from '../../../app/_components/BackButton'

interface ArtistFormProps {
  initialData?: Artist
  onSubmit: (data: any) => void
  errors?: string[]
  backHref: string
}

export default function ArtistForm({ initialData, onSubmit, errors, backHref }: ArtistFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [sort, setSort] = useState(initialData?.sort || '')
  const [slug, setSlug] = useState(initialData?.slug || '')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSort(initialData.sort || '')
      setSlug(initialData.slug || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      sort,
      slug,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.length > 0 && (
        <div id="error_explanation" style={{ color: 'red' }}>
          <h2>{errors.length} error{errors.length > 1 ? 's' : ''} prohibited this artist from being saved:</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="name" style={{ display: 'block' }}>Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="sort" style={{ display: "block" }}>Sort</label>
        <input
          type="text"
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="slug" style={{ display: "block" }}>Slug</label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div className="actions flex items-center gap-2 mt-4">
        <button type="submit">Submit</button>
        <BackButton href={backHref} />
      </div>
    </form>
  )
}
