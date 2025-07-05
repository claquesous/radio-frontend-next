// Pagination for Songs admin page

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Song } from '../../_types/types'
import api from '../../../lib/api'

const PAGE_SIZE = 25

export default function SongsIndexPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalSongs, setTotalSongs] = useState(0)

  const totalPages = Math.max(1, Math.ceil(totalSongs / PAGE_SIZE))

  const fetchSongs = async (page: number) => {
    try {
      const offset = (page - 1) * PAGE_SIZE
      const response = await api.get<{ songs: Song[]; total: number }>(
        `/songs?limit=${PAGE_SIZE}&offset=${offset}`
      )
      setSongs(response.data.songs)
      setTotalSongs(response.data.total)
      setNotice('Songs loaded successfully!')
    } catch (error) {
      console.error('Failed to fetch songs', error)
      setNotice('Failed to load songs.')
    }
  }

  useEffect(() => {
    fetchSongs(currentPage)
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

      <h1>Listing Songs</h1>

      <div className="mb-4 text-sm text-gray-600">
        Showing {songs.length} of {totalSongs} songs
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Artist</th>
            <th>Artist Name Override</th>
            <th>Title</th>
            <th>Sort</th>
            <th>Slug</th>
            <th>Track</th>
            <th>Time</th>
            <th>Live</th>
            <th>Remix</th>
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
              <td>{song.sort}</td>
              <td>{song.slug}</td>
              <td>{song.track}</td>
              <td>{song.time}</td>
              <td>{song.live ? 'Yes' : 'No'}</td>
              <td>{song.remix ? 'Yes' : 'No'}</td>
              <td>{song.year}</td>
              <td><Link href={`/admin/songs/${song.id}`}>Show</Link></td>
              <td><Link href={`/admin/songs/${song.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}

      <br />

      <Link href="/admin/songs/new" className="btn">New Song</Link>
    </div>
  )
}
