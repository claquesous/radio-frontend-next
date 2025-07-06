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

      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Title</th>
            <th></th>
            <th className="w-48"></th>
          </tr>
        </thead>

        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td><Link href={`/admin/artists/${song.artist.id}`}>{song.artist.name}</Link></td>
              <td>{song.title}</td>
              <td className="w-48">
                <div className="flex gap-2 w-full">
                  <Link href={`/admin/songs/${song.id}`} className="flex-1">
                    <span className="w-full block px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-center">Show</span>
                  </Link>
                  <div className="flex-1">
                    <PencilEditButton href={`/admin/songs/${song.id}/edit`} className="w-full" />
                  </div>
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

      <Link href="/admin/songs/new" className="btn">New Song</Link>
    </div>
  )
}
