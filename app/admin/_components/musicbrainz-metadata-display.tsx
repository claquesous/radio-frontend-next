'use client'

import React from 'react'
import TimeAgo from '../../s/[streamId]/_components/timeago'

interface MusicbrainzMetadata {
  id?: string
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
  images?: string[] | { thumbnails?: { [key: string]: string } }
  length?: number
  fetched_at: string
}

interface MusicbrainzMetadataDisplayProps {
  metadata: MusicbrainzMetadata
  entityType: 'artists' | 'albums' | 'songs'
  showFetchedAt?: boolean
}

export default function MusicbrainzMetadataDisplay({
  metadata,
  entityType,
  showFetchedAt = true
}: MusicbrainzMetadataDisplayProps) {
  const mappedMetadata = {
    ...metadata,
    type: metadata.type || (metadata as any)['primary-type'] || 'Unknown',
    first_release_date: metadata.first_release_date || (metadata as any)['first-release-date'] || '',
  };
  const mbid = mappedMetadata?.id;
  if (!mappedMetadata || !mbid) {
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
          <span className="font-medium">Name:</span> {mappedMetadata.name || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Type:</span> {mappedMetadata.type || 'Unknown'}
        </div>
        {mappedMetadata.country && (
          <div>
            <span className="font-medium">Country:</span> {mappedMetadata.country}
          </div>
        )}
        {mappedMetadata.life_span && (
          <div>
            <span className="font-medium">Active:</span>{' '}
            {mappedMetadata.life_span.begin || '?'} - {mappedMetadata.life_span.end || 'present'}
          </div>
        )}
      </div>
      {mappedMetadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {mappedMetadata.disambiguation}
        </div>
      )}
    </div>
  )

  const renderAlbumMetadata = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Title:</span> {mappedMetadata.title || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Type:</span> {mappedMetadata.type || 'Unknown'}
        </div>
        {mappedMetadata.first_release_date && (
          <div>
            <span className="font-medium">First Release:</span> {formatDate(mappedMetadata.first_release_date)}
          </div>
        )}
        {mappedMetadata.secondary_types && mappedMetadata.secondary_types.length > 0 && (
          <div>
            <span className="font-medium">Secondary Types:</span> {mappedMetadata.secondary_types.join(', ')}
          </div>
        )}
      </div>
      {mappedMetadata.artist_credits && mappedMetadata.artist_credits.length > 0 && (
        <div>
          <span className="font-medium">Artists:</span>{' '}
          {mappedMetadata.artist_credits.map(ac => ac.name).join(', ')}
        </div>
      )}
      {mappedMetadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {mappedMetadata.disambiguation}
        </div>
      )}
    </div>
  )

  const renderSongMetadata = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Title:</span> {mappedMetadata.title || 'Unknown'}
        </div>
        {mappedMetadata.length && (
          <div>
            <span className="font-medium">Length:</span> {Math.floor(mappedMetadata.length / 60000)}:{String(Math.floor((mappedMetadata.length % 60000) / 1000)).padStart(2, '0')}
          </div>
        )}
      </div>
      {mappedMetadata.artist_credits && mappedMetadata.artist_credits.length > 0 && (
        <div>
          <span className="font-medium">Artists:</span>{' '}
          {mappedMetadata.artist_credits.map(ac => ac.name).join(', ')}
        </div>
      )}
      {mappedMetadata.disambiguation && (
        <div>
          <span className="font-medium">Disambiguation:</span> {mappedMetadata.disambiguation}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-800 dark:text-green-200">Musicbrainz Metadata</h4>
        {showFetchedAt && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Fetched: {mappedMetadata.fetched_at ? <TimeAgo date={mappedMetadata.fetched_at} /> : 'Unknown'}
          </span>
        )}
      </div>

      {entityType === 'artists' && renderArtistMetadata()}
      {entityType === 'albums' && renderAlbumMetadata()}
      {entityType === 'songs' && renderSongMetadata()}

      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="text-xs text-gray-600 mb-2 dark:text-gray-300">
          <span className="font-medium">MBID:</span> {mbid}
        </div>

        {entityType === 'albums' &&
          typeof mappedMetadata.images === 'object' &&
          mappedMetadata.images !== null &&
          'thumbnails' in mappedMetadata.images &&
          mappedMetadata.images.thumbnails &&
          mappedMetadata.images.thumbnails['250'] && (
            <div className="mb-3">
              <div className="font-medium text-sm mb-2">Album Cover:</div>
              <img
                src={mappedMetadata.images.thumbnails['250']}
                alt="Album Cover"
                className="w-40 h-40 object-cover rounded border border-gray-300 dark:border-gray-600"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
        )}

        {mappedMetadata.images && Array.isArray(mappedMetadata.images) && mappedMetadata.images.length > 0 && (
          <div className="mb-3">
            <div className="font-medium text-sm mb-2">Images:</div>
            <div className="flex gap-2 flex-wrap">
              {mappedMetadata.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${entityType} image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {mappedMetadata.urls && mappedMetadata.urls.length > 0 && (
          <div>
            <div className="font-medium text-sm mb-2">External Links:</div>
            <div className="flex gap-2 flex-wrap">
              {mappedMetadata.urls.slice(0, 5).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
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
