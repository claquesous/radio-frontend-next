'use client'

import React, { useState, useEffect } from 'react'
import { Album } from '../app/_types/types'

interface AlbumFormProps {
  initialData?: Album
  onSubmit: (data: any) => void
  errors?: string[]
}

export default function AlbumForm({ initialData, onSubmit, errors }: AlbumFormProps) {
  const [artistId, setArtistId] = useState(initialData?.artist?.id || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [sort, setSort] = useState(initialData?.sort || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [tracks, setTracks] = useState(initialData?.tracks || '')
  const [id3Genre, setId3Genre] = useState(initialData?.id3_genre || '')
  const [recordLabel, setRecordLabel] = useState(initialData?.record_label || '')

  useEffect(() => {
    if (initialData) {
      setArtistId(initialData.artist?.id || '')
      setTitle(initialData.title)
      setSort(initialData.sort || '')
      setSlug(initialData.slug || '')
      setTracks(initialData.tracks || '')
      setId3Genre(initialData.id3_genre || '')
      setRecordLabel(initialData.record_label || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      artist_id: artistId,
      title,
      sort,
      slug,
      tracks,
      id3_genre: id3Genre,
      record_label: recordLabel,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.length > 0 && (
        <div id="error_explanation" style={{ color: 'red' }}>
          <h2>{errors.length} error{errors.length > 1 ? 's' : ''} prohibited this album from being saved:</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="artist_id" style={{ display: 'block' }}>Artist</label>
        <input
          type="text"
          id="artist_id"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="title" style={{ display: 'block' }}>Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="sort" style={{ display: 'block' }}>Sort</label>
        <input
          type="text"
          id="sort"
          value={sort}
          onChange={(e) => setSort(Number(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="slug" style={{ display: 'block' }}>Slug</label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="tracks" style={{ display: 'block' }}>Tracks</label>
        <input
          type="text"
          id="tracks"
          value={tracks}
          onChange={(e) => setTracks(Number(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="id3_genre" style={{ display: 'block' }}>Id3 genre</label>
        <input
          type="text"
          id="id3_genre"
          value={id3Genre}
          onChange={(e) => setId3Genre(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="record_label" style={{ display: 'block' }}>Record label</label>
        <input
          type="text"
          id="record_label"
          value={recordLabel}
          onChange={(e) => setRecordLabel(e.target.value)}
        />
      </div>
      <div className="actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
