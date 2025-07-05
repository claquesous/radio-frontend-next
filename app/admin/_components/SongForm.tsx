'use client'

import React, { useState, useEffect } from 'react'
import { Song } from '../../_types/types'

import BackButton from '../../../app/_components/BackButton'

interface SongFormProps {
  initialData?: Song
  onSubmit: (data: any) => void
  errors?: string[]
  backHref: string
}

export default function SongForm({ initialData, onSubmit, errors, backHref }: SongFormProps) {
  const [albumId, setAlbumId] = useState(initialData?.album?.id || '')
  const [artistId, setArtistId] = useState(initialData?.artist?.id || '')
  const [artistNameOverride, setArtistNameOverride] = useState(initialData?.artist_name_override || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [sort, setSort] = useState(initialData?.sort || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [track, setTrack] = useState(initialData?.track || '')
  const [time, setTime] = useState(initialData?.time || '')
  const [live, setLive] = useState(initialData?.live || false)
  const [remix, setRemix] = useState(initialData?.remix || false)
  const [year, setYear] = useState(initialData?.year || '')

  useEffect(() => {
    if (initialData) {
      setAlbumId(initialData.album?.id || '')
      setArtistId(initialData.artist.id || '')
      setArtistNameOverride(initialData.artist_name_override || '')
      setTitle(initialData.title)
      setSort(initialData.sort || '')
      setSlug(initialData.slug || '')
      setTrack(initialData.track || '')
      setTime(initialData.time || '')
      setLive(initialData.live)
      setRemix(initialData.remix)
      setYear(initialData.year || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      album_id: albumId,
      artist_id: artistId,
      artist_name_override: artistNameOverride,
      title,
      sort,
      slug,
      track,
      time,
      live,
      remix,
      year,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.length > 0 && (
        <div id="error_explanation" style={{ color: 'red' }}>
          <h2>{errors.length} error{errors.length > 1 ? 's' : ''} prohibited this song from being saved:</h2>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="album_id" style={{ display: 'block' }}>Album</label>
        <input
          type="text"
          id="album_id"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        />
      </div>
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
        <label htmlFor="artist_name_override" style={{ display: 'block' }}>Artist Name Override</label>
        <input
          type="text"
          id="artist_name_override"
          value={artistNameOverride}
          onChange={(e) => setArtistNameOverride(e.target.value)}
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
          onChange={(e) => setSort(e.target.value)}
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
        <label htmlFor="track" style={{ display: 'block' }}>Track</label>
        <input
          type="text"
          id="track"
          value={track}
          onChange={(e) => setTrack(Number(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="time" style={{ display: 'block' }}>Time</label>
        <input
          type="text"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="live" style={{ display: 'block' }}>Live</label>
        <input
          type="checkbox"
          id="live"
          checked={live}
          onChange={(e) => setLive(e.target.checked)}
        />
      </div>
      <div className="field">
        <label htmlFor="remix" style={{ display: 'block' }}>Remix</label>
        <input
          type="checkbox"
          id="remix"
          checked={remix}
          onChange={(e) => setRemix(e.target.checked)}
        />
      </div>
      <div className="field">
        <label htmlFor="year" style={{ display: 'block' }}>Year</label>
        <input
          type="text"
          id="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>
      <div className="actions flex items-center gap-2 mt-4">
        <button type="submit">Submit</button>
        <BackButton href={backHref} />
      </div>
    </form>
  )
}
