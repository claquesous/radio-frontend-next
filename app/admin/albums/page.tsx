// Pagination for Albums admin page

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Album } from '../../_types/types'
import api from '../../../lib/api'

const PAGE_SIZE = 25

export default function AlbumsIndexPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAlbums, setTotalAlbums] = useState(0)

  const totalPages = Math.max(1, Math.ceil(totalAlbums / PAGE_SIZE))

  const fetchAlbums = async (page: number) => {
    try {
      const offset = (page - 1) * PAGE_SIZE
      const response = await api.get<{ albums: Album[]; total: number }>(
        `/albums?limit=${PAGE_SIZE}&offset=${offset}`
      )
      setAlbums(response.data.albums)
      setTotalAlbums(response.data.total)
      setNotice('Albums loaded successfully!')
    } catch (error) {
      console.error('Failed to fetch albums', error)
      setNotice('Failed to load albums.')
    }
  }

  useEffect(() => {
    fetchAlbums(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-center mt-6 w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent sm:overflow-x-visible gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-w-0"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm sm:text-base min-w-0"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded text-sm sm:text-base min-w-0 ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm sm:text-base min-w-0"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-w-0"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div>
      {notice && <p id="notice" style={{ color: 'green' }}>{notice}</p>}

      <h1>Listing Albums</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {albums.length} of {totalAlbums} albums
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
              <td><Link href={`/admin/albums/${album.id}`}>Show</Link></td>
              <td><Link href={`/admin/albums/${album.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}

      <br />

      <Link href="/admin/albums/new" className="btn">New Album</Link>
    </div>
  )
}
