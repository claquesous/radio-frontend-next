'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Song } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/use-pagination'
import { usePaginatedData } from '../../_hooks/use-paginated-data'
import Pagination from '../../_components/pagination'
import EditButton from '../../_components/edit-button'

const PAGE_SIZE = 25

export default function SongsIndexPage() {
  const fetchSongs = useCallback(async (limit: number, offset: number) => {
    const response = await api.get<{ songs: Song[]; total: number }>(
      `/songs?limit=${limit}&offset=${offset}`
    )
    return {
      data: response.data.songs,
      total: response.data.total
    }
  }, [])

  const { data: songs, totalItems, error, fetchPage } = usePaginatedData({
    fetchFunction: fetchSongs,
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

      <h1>Listing Songs</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {songs.length} of {totalItems} songs
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <div className="flex flex-col">
        <div className="hidden md:flex font-semibold border-b">
          <div className="flex-[2] px-0 py-2">Artist</div>
          <div className="flex-[3] px-0 py-2">Title</div>
          <div className="flex-1 px-0 py-2 text-right">Actions</div>
        </div>
        {songs.map((song) => (
          <div key={song.id} className="flex flex-row items-center border-b">
            <div className="flex-[2] flex items-center px-0 py-2">
              <Link href={`/admin/artists/${song.artist.id}`}>{song.artist.name}</Link>
            </div>
            <div className="flex-[3] flex items-center px-0 py-2">{song.title}</div>
            <div className="flex gap-2 items-center flex-1 px-0 py-2 justify-end">
              <Link href={`/admin/songs/${song.id}`}>
                <span className="px-3 py-1 flex items-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-center">Show</span>
              </Link>
              <EditButton href={`/admin/songs/${song.id}/edit`} />
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

      <Link href="/admin/songs/new" className="btn">New Song</Link>
    </div>
  )
}
