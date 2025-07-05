'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Artist } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/usePagination'
import { usePaginatedData } from '../../_hooks/usePaginatedData'
import Pagination from '../../_components/Pagination'

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
    <div>
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
            <th>Sort</th>
            <th>Slug</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.name}</td>
              <td>{artist.sort}</td>
              <td>{artist.slug}</td>
              <td><Link href={`/admin/artists/${artist.id}`}>Show</Link></td>
              <td><Link href={`/admin/artists/${artist.id}/edit`}>Edit</Link></td>
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
