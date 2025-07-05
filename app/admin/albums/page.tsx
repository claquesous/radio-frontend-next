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
    <div>
      {error && <p id="notice" style={{ color: 'red' }}>{error}</p>}

      <h1>Listing Albums</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {albums.length} of {totalItems} albums
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Title</th>
            <th>Sort</th>
            <th>Slug</th>
            <th>Tracks</th>
            <th>Id3 genre</th>
            <th>Record label</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {albums.map((album) => (
            <tr key={album.id}>
              <td><Link href={`/admin/artists/${album.artist.id}`}>{album.artist.name}</Link></td>
              <td>{album.title}</td>
              <td>{album.sort}</td>
              <td>{album.slug}</td>
              <td>{album.tracks}</td>
              <td>{album.id3_genre}</td>
              <td>{album.record_label}</td>
              <td>
                <div className="flex gap-2">
                  <Link href={`/admin/albums/${album.id}`}>
                    <span className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer inline-block">Show</span>
                  </Link>
                  <PencilEditButton href={`/admin/albums/${album.id}/edit`} />
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

      <Link href="/admin/albums/new" className="btn">New Album</Link>
    </div>
  )
}
