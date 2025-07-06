'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'

import { Song } from '../../_types/types'
import api from '../../../lib/api'
import { usePagination } from '../../_hooks/usePagination'
import { usePaginatedData } from '../../_hooks/usePaginatedData'
import Pagination from '../../_components/Pagination'
import PencilEditButton from '../../_components/pencil-edit-button'

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

      <div className="flex flex-col gap-2">
        <div className="hidden md:flex font-semibold border-b pb-2 mb-2">
          <div className="flex-1">Artist</div>
          <div className="flex-1">Title</div>
          <div className="flex-1 text-right">Actions</div>
        </div>
        {songs.map((song) => (
          <div key={song.id} className="flex flex-col md:flex-row items-stretch border-b py-2 gap-2">
            <div className="flex-1 flex items-center">
              <Link href={`/admin/artists/${song.artist.id}`}>{song.artist.name}</Link>
            </div>
            <div className="flex-1 flex items-center">{song.title}</div>
            <div className="flex gap-2">
              <Link href={`/admin/songs/${song.id}`}>
                <span className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-center">Show</span>
              </Link>
              <PencilEditButton href={`/admin/songs/${song.id}/edit`} />
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
