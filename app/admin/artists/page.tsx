'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Artist } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/usePagination'
import { usePaginatedData } from '../../_hooks/usePaginatedData'
import Pagination from '../../_components/Pagination'
import PencilEditButton from '../../_components/pencil-edit-button'

const PAGE_SIZE = 25

export default function ArtistsIndexPage() {
  const fetchArtists = useCallback(async (limit: number, offset: number) => {
    const response = await api.get<{ artists: Artist[]; total: number }>(
      `/artists?limit=${limit}&offset=${offset}`
    )
    return {
      data: response.data.artists,
      total: response.data.total
    }
  }, [])

  const { data: artists, totalItems, error, fetchPage } = usePaginatedData({
    fetchFunction: fetchArtists,
    pageSize: PAGE_SIZE
  })

  const { currentPage, totalPages, handlePageChange, offset } = usePagination({
    totalItems,
    pageSize: PAGE_SIZE
  })

  useEffect(() => {
    fetchPage(offset)
  }, [fetchPage, offset])

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {error && <p id="notice" style={{ color: 'red' }}>{error}</p>}

      <h1>Listing Artists</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {artists.length} of {totalItems} artists
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.name}</td>
              <td>
                <div className="flex gap-2">
                  <Link href={`/admin/artists/${artist.id}`}>
                    <span className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer inline-block">Show</span>
                  </Link>
                  <PencilEditButton href={`/admin/artists/${artist.id}/edit`} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <br />

      <Link href="/admin/artists/new" className="btn">New Artist</Link>
    </div>
  )
}
