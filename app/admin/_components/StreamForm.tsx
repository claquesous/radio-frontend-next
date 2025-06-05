'use client'

import React, { useState, useEffect } from 'react'

import { Stream } from '../../_types/types'

interface StreamFormProps {
  initialData?: Stream
  onSubmit: (data: any) => void
  errors?: string[]
}

export default function StreamForm({ initialData, onSubmit, errors }: StreamFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [defaultRating, setDefaultRating] = useState(initialData?.default_rating || 0)
  const [defaultFeatured, setDefaultFeatured] = useState(initialData?.default_featured || false)
  const [mastodonUrl, setMastodonUrl] = useState(initialData?.mastodon_url || '')
  const [mastodonAccessToken, setMastodonAccessToken] = useState(initialData?.mastodon_access_token || '')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDefaultRating(initialData.default_rating)
      setDefaultFeatured(initialData.default_featured)
      setMastodonUrl(initialData.mastodon_url)
      setMastodonAccessToken(initialData.mastodon_access_token)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, default_rating: defaultRating, default_featured: defaultFeatured, mastodon_url: mastodonUrl, mastodon_access_token: mastodonAccessToken })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <h2>{errors.length} error{errors.length > 1 ? 's' : ''} prohibited this stream from being saved:</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="name" style={{ display: 'block' }}>Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="default_rating" style={{ display: 'block' }}>Default Rating</label>
        <input
          type="number"
          id="default_rating"
          value={defaultRating}
          onChange={(e) => setDefaultRating(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="default_featured" style={{ display: 'block' }}>Include new songs automatically?</label>
        <input
          type="checkbox"
          id="default_featured"
          checked={defaultFeatured}
          onChange={(e) => setDefaultFeatured(e.target.checked)}
        />
      </div>

      <div>
        <label htmlFor="mastodon_url" style={{ display: 'block' }}>Mastodon URL</label>
        <input
          type="text"
          id="mastodon_url"
          value={mastodonUrl}
          onChange={(e) => setMastodonUrl(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="mastodon_access_token" style={{ display: 'block' }}>Mastodon Access Token</label>
        <input
          type="password"
          id="mastodon_access_token"
          value={mastodonAccessToken}
          onChange={(e) => setMastodonAccessToken(e.target.value)}
        />
      </div>

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
