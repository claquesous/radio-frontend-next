'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Album } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/usePagination'
import { usePaginatedData } from '../../_hooks/usePaginatedData'
import Pagination from '../../_components/Pagination'
import PencilEditButton from '../../_components/pencil-edit-button'

const PAGE_SIZE = 25

export default function AlbumsIndexPage() {
  const fetchAlbums = useCallback(async (limit: number, offset: number) => {
    const response = await api.get<{ albums: Album[]; total: number }>(
      `/albums?limit=${limit}&offset=${offset}`
    )
    return {
      data: response.data.albums,
      total: response.data.total
    }
  }, [])

  const { data: albums, totalItems, error, fetchPage } = usePaginatedData({
    fetchFunction: fetchAlbums,
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

      <h1>Listing Albums</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {albums.length} of {totalItems} albums
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <div className="flex flex-col">
        <div className="hidden md:flex font-semibold border-b">
          <div className="flex-[2] px-0 py-2">Artist</div>
          <div className="flex-[3] px-0 py-2">Title</div>
          <div className="flex-1 px-0 py-2 text-right">Actions</div>
        </div>
        {albums.map((album) => (
          <div key={album.id} className="flex flex-row items-center border-b">
            <div className="flex-[2] flex items-center px-0 py-2">
              <Link href={`/admin/artists/${album.artist.id}`}>{album.artist.name}</Link>
            </div>
            <div className="flex-[3] flex items-center px-0 py-2">{album.title}</div>
            <div className="flex gap-2 items-center flex-1 px-0 py-2 justify-end">
              <Link href={`/admin/albums/${album.id}`}>
                <span className="px-3 py-1 flex items-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-center">Show</span>
              </Link>
              <PencilEditButton href={`/admin/albums/${album.id}/edit`} />
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

      <Link href="/admin/albums/new" className="btn">New Album</Link>
    </div>
  )
}
