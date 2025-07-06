'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Artist } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/usePagination'
import { usePaginatedData } from '../../_hooks/usePaginatedData'
import Pagination from '../../_components/Pagination'
import EditButton from '../../_components/EditButton'

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

      <div className="flex flex-col">
        <div className="hidden md:flex font-semibold border-b">
          <div className="flex-[2] px-0 py-2">Name</div>
          <div className="flex-1 px-0 py-2 text-right">Actions</div>
        </div>
        {artists.map((artist) => (
          <div key={artist.id} className="flex flex-row items-center border-b">
            <div className="flex-[2] flex items-center px-0 py-2">{artist.name}</div>
            <div className="flex gap-2 items-center flex-1 px-0 py-2 justify-end">
              <Link href={`/admin/artists/${artist.id}`}>
                <span className="px-3 py-1 flex items-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-center">Show</span>
              </Link>
              <EditButton href={`/admin/artists/${artist.id}/edit`} />
            </div>
          </div>
        ))}
      </div>

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
