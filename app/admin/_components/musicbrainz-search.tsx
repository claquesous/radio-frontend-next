'use client'

import React, { useState } from 'react'

interface MusicbrainzResult {
  id: string
  name?: string
  title?: string
  score: number
  disambiguation?: string
  'artist-credit'?: Array<{ name: string }>
  'first-release-date'?: string
  'primary-type'?: string
  annotation?: string
  relations?: Array<{ type: string; artist: { name: string } }>
}

interface MusicbrainzSearchProps {
  entityType: 'artists' | 'albums' | 'songs'
  entityName: string
  onMetadataSaved?: (metadata: any) => void
}

export default function MusicbrainzSearch({
  entityType,
  entityName,
  onMetadataSaved
}: MusicbrainzSearchProps) {
  const [results, setResults] = useState<MusicbrainzResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const searchMusicbrainz = async () => {
    const trimmedName = entityName.trim()
    if (!trimmedName) return

    setLoading(true)
    setError(null)
    setResults([])
    setHasSearched(true)

    try {
      const response = await fetch(
        `/search/musicbrainz?entity=${encodeURIComponent(entityType.slice(0, -1))}&query=${encodeURIComponent(trimmedName)}&limit=10`
      )
      const data = await response.json()
      // Musicbrainz returns results in different keys depending on entity
      let results: MusicbrainzResult[] = []
      if (entityType === 'artists') {
        results = data.artists || []
      } else if (entityType === 'albums') {
        results = data['release-groups'] || []
      } else if (entityType === 'songs') {
        results = data.recordings || []
      }
      setResults(results)
    } catch (err: any) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const saveMetadata = async (metadata: any) => {
    setSuccess(null)
    setResults([])
    try {
      let fullMetadata = metadata
      if (entityType === 'artists') {
        const response = await fetch(
          `/search/musicbrainz?entity=artist&id=${encodeURIComponent(metadata.id)}&inc=annotation+genres+artist-rels+url-rels`
        )
        if (response.ok) {
          const data = await response.json()
          fullMetadata = data.artist || metadata
        }
      }
      if (entityType === 'albums') {
        try {
          const mbid = metadata.id
          const response = await fetch(`/search/musicbrainz?entity=album&id=${encodeURIComponent(mbid)}&inc=label-info-list+labels`)
          if (response.ok) {
            const data = await response.json()
            if (data.album?.cover_art_url) {
              fullMetadata.images = fullMetadata.images || {}
              fullMetadata.images.thumbnails = fullMetadata.images.thumbnails || {}
              fullMetadata.images.thumbnails['250'] = data.album.cover_art_url
              fullMetadata.cover_art_url = data.album.cover_art_url
            }
          }
        } catch {}
      }
      setSuccess('Metadata selected!')
      onMetadataSaved?.({ ...fullMetadata, fetched_at: new Date().toISOString() })
    } catch {
      setSuccess('Metadata selected!')
      onMetadataSaved?.({ ...metadata, fetched_at: new Date().toISOString() })
    }
  }

  const formatResult = (result: MusicbrainzResult) => {
    switch (entityType) {
      case 'artists':
        return {
          title: result.name || 'Unknown Artist',
          subtitle: result.disambiguation || '',
          score: result.score
        }
      case 'albums':
        return {
          title: result.title || 'Unknown Album',
          subtitle: `${result['artist-credit']?.[0]?.name || 'Unknown Artist'} • ${result['first-release-date'] || 'Unknown Date'} • ${result['primary-type'] || 'Unknown Type'}`,
          score: result.score
        }
      case 'songs':
        return {
          title: result.title || 'Unknown Song',
          subtitle: `${result['artist-credit']?.[0]?.name || 'Unknown Artist'} • ${result['first-release-date'] || 'Unknown Date'}`,
          score: result.score
        }
      default:
        return { title: 'Unknown', subtitle: '', score: 0 }
    }
  }

  return (
    <div className="musicbrainz-search bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Fetch Musicbrainz Metadata
      </h3>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded mb-3">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-3 py-2 rounded mb-3">
          {success}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={searchMusicbrainz}
          disabled={loading || !entityName.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Search Results:</h4>
          {results.map((result) => {
            const formatted = formatResult(result)
            return (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{formatted.title}</div>
                  {formatted.subtitle && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formatted.subtitle}</div>
                  )}
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                    Score: {Math.round(formatted.score)}% • MBID: {result.id}
                  </div>
                  {result.annotation && (
                    <div
                      className="text-sm text-gray-600 dark:text-gray-300 mt-2 prose"
                      dangerouslySetInnerHTML={{ __html: result.annotation }}
                    />
                  )}
                  {result.relations && result.relations.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        Related Artists
                      </h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300">
                        {result.relations.map((rel, i) => (
                          <li key={i}>
                            {rel.type}: {rel.artist.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => saveMetadata(result)}
                  className="ml-3 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            )
          })}
        </div>
      )}

      {results.length === 0 && hasSearched && !loading && success === null && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          No results found.
        </div>
      )}
    </div>
  )
}
