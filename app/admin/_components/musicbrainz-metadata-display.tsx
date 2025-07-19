'use client'

import React from 'react'

interface MusicbrainzMetadata {
  mbid: string
  name?: string
  title?: string
  type?: string
  disambiguation?: string
  country?: string
  life_span?: {
    begin?: string
    end?: string
  }
  first_release_date?: string
  secondary_types?: string[]
  artist_credits?: Array<{ name: string }>
  urls?: Array<{ type: string; url: string }>
  images?: string[]
  length?: number
  fetched_at: string
}

interface MusicbrainzMetadataDisplayProps {
  metadata: MusicbrainzMetadata
  entityType: 'artists' | 'albums' | 'songs'
}

export default function MusicbrainzMetadataDisplay({
  metadata,
  entityType
}: MusicbrainzMetadataDisplayProps) {
  if (!metadata || !metadata.mbid) {
    return (
      <div className="text-gray-500 text-sm">
        No Musicbrainz metadata available
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown'
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const renderArtistMetadata = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Name:</span> {metadata.name || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Type:</span> {metadata.type || 'Unknown'}
        </div>
        {metadata.country && (
          <div>
            <span className="font-medium">Country:</span> {metadata.country}
          </div>
        )}
        {metadata.life_span && (
          <div>
            <span className="font-medium">Active:</span>{' '}
            {metadata.life_span.begin || '?'} - {metadata.life_span.end || 'present'}
          </div>
        )}
      </div>
      {metadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {metadata.disambiguation}
        </div>
      )}
    </div>
  )

  const renderAlbumMetadata = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Title:</span> {metadata.title || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Type:</span> {metadata.type || 'Unknown'}
        </div>
        {metadata.first_release_date && (
          <div>
            <span className="font-medium">First Release:</span> {formatDate(metadata.first_release_date)}
          </div>
        )}
        {metadata.secondary_types && metadata.secondary_types.length > 0 && (
          <div>
            <span className="font-medium">Secondary Types:</span> {metadata.secondary_types.join(', ')}
          </div>
        )}
      </div>
      {metadata.artist_credits && metadata.artist_credits.length > 0 && (
        <div>
          <span className="font-medium">Artists:</span>{' '}
          {metadata.artist_credits.map(ac => ac.name).join(', ')}
        </div>
      )}
      {metadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {metadata.disambiguation}
        </div>
      )}
    </div>
  )

  const renderSongMetadata = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Title:</span> {metadata.title || 'Unknown'}
        </div>
        {metadata.length && (
          <div>
            <span className="font-medium">Length:</span> {Math.floor(metadata.length / 60000)}:{String(Math.floor((metadata.length % 60000) / 1000)).padStart(2, '0')}
          </div>
        )}
      </div>
      {metadata.artist_credits && metadata.artist_credits.length > 0 && (
        <div>
          <span className="font-medium">Artists:</span>{' '}
          {metadata.artist_credits.map(ac => ac.name).join(', ')}
        </div>
      )}
      {metadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {metadata.disambiguation}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-800">Musicbrainz Metadata</h4>
        <span className="text-xs text-gray-500">
          Fetched: {formatDate(metadata.fetched_at)}
        </span>
      </div>

      {entityType === 'artists' && renderArtistMetadata()}
      {entityType === 'albums' && renderAlbumMetadata()}
      {entityType === 'songs' && renderSongMetadata()}

      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">MBID:</span> {metadata.mbid}
        </div>

        {metadata.images && metadata.images.length > 0 && (
          <div className="mb-3">
            <div className="font-medium text-sm mb-2">Images:</div>
            <div className="flex gap-2 flex-wrap">
              {metadata.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${entityType} image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border border-gray-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {metadata.urls && metadata.urls.length > 0 && (
          <div>
            <div className="font-medium text-sm mb-2">External Links:</div>
            <div className="flex gap-2 flex-wrap">
              {metadata.urls.slice(0, 5).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                >
                  {new URL(link.url).hostname}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
