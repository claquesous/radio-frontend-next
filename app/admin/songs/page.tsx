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
    <div>
      {error && <p id="notice" style={{ color: 'red' }}>{error}</p>}

      <h1>Listing Songs</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {songs.length} of {totalItems} songs
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Artist</th>
            <th>Artist Name Override</th>
            <th>Title</th>
            <th>Year</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.album ? <Link href={`/admin/albums/${song.album.id}`}>{song.album.title}</Link> : 'N/A'}</td>
              <td><Link href={`/admin/artists/${song.artist.id}`}>{song.artist.name}</Link></td>
              <td>{song.artist_name_override}</td>
              <td>{song.title}</td>
              <td>{song.year}</td>
              <td>
                <div className="flex gap-2">
                  <Link href={`/admin/songs/${song.id}`}>
                    <span className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer inline-block">Show</span>
                  </Link>
                  <PencilEditButton href={`/admin/songs/${song.id}/edit`} />
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
