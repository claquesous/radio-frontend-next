'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ChooserCard from '../../../_components/ChooserCard'
import Enqueue from '../../../../_components/enqueue'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import DeleteButton from '../../../../_components/delete-button'
import Pagination from '../../../../_components/pagination'
import { Chooser } from '../../../../_types/types'
import api from '../../../../../lib/api'
import SongPicker, { PickerMode, SeedSong } from '../_components/SongPicker'

const PAGE_SIZE = 50

type PlaylistStats = {
  songs: number
  artists: number
  required_songs: number
  required_artists: number
  similar_songs_available: boolean
}

type StreamInfo = {
  id: number
  name: string
  enabled: boolean
  default_rating: number
  playlist?: PlaylistStats
}

interface PlaylistItemProps {
  chooser: Chooser
  streamId: number
  onDelete: (chooserId: number) => void
  // Absent when similar songs aren't available.
  onFindSimilar?: (seed: SeedSong) => void
}

function RowActions({ chooser, streamId, onDelete, onFindSimilar }: PlaylistItemProps) {
  return (
    <div
      className="flex gap-2"
      onPointerDown={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {onFindSimilar && <button
        onClick={() => onFindSimilar({ id: chooser.song.id, title: chooser.song.title })}
        className="w-8 h-8 p-0 rounded bg-transparent font-normal text-lg leading-none text-slate-400 hover:text-[#8EF7FA] hover:bg-slate-700/60"
        title={`Find songs similar to “${chooser.song.title}”`}
        aria-label={`Find songs similar to ${chooser.song.title}`}
      >
        ≈
      </button>}
      <Enqueue streamId={streamId} songId={chooser.song.id} />
      <DeleteButton
        onClick={e => {
          e.stopPropagation()
          onDelete(chooser.id)
        }}
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
        title="Remove from playlist"
      />
    </div>
  )
}

function SortablePlaylistItem(props: PlaylistItemProps) {
  const { chooser, streamId } = props
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chooser.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative"
    >
      <div className="flex flex-row items-center w-full gap-2 sm:gap-4">
        <div
          {...listeners}
          className="flex items-center justify-center w-8 h-10 cursor-grab z-10"
          style={{ userSelect: 'none' }}
          title="Drag to reorder"
        >
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none" aria-hidden="true">
            <circle cx="6" cy="7" r="2" fill="#888" />
            <circle cx="14" cy="7" r="2" fill="#888" />
            <circle cx="6" cy="16" r="2" fill="#888" />
            <circle cx="14" cy="16" r="2" fill="#888" />
            <circle cx="6" cy="25" r="2" fill="#888" />
            <circle cx="14" cy="25" r="2" fill="#888" />
          </svg>
        </div>
        <ChooserCard chooser={chooser} streamId={streamId} />
        <span className="text-gray-600">{chooser.rating.toFixed(2)}</span>
        <RowActions {...props} />
      </div>
    </div>
  )
}

function Meter({ label, value, required }: { label: string; value: number; required: number }) {
  const done = value >= required
  return (
    <div className="flex-1 min-w-[10rem]">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={done ? 'text-[#8EF7FA]' : 'text-slate-300'}>
          {value} / {required}{done ? ' ✓' : ''}
        </span>
      </div>
      <div className="h-1.5 rounded bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded transition-all ${done ? 'bg-[#8EF7FA]' : 'bg-[#8EF7FA]/50'}`}
          style={{ width: `${Math.min(100, (value / required) * 100)}%` }}
        />
      </div>
    </div>
  )
}

// How far the playlist is from the variety the stream needs before it can go live.
function GoLiveProgress({ stream }: { stream: StreamInfo }) {
  const stats = stream.playlist
  if (!stats) return null
  const ready = stats.songs >= stats.required_songs && stats.artists >= stats.required_artists

  return (
    <div className="mb-4 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
      <div className="flex flex-wrap gap-4">
        <Meter label="Songs" value={stats.songs} required={stats.required_songs} />
        <Meter label="Artists" value={stats.artists} required={stats.required_artists} />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {stream.enabled
          ? 'This stream is live.'
          : ready
            ? <>Ready to go live — <Link href={`/manage/streams/${stream.id}/edit`} className="text-[#8EF7FA] hover:underline">enable the stream</Link>.</>
            : `A stream needs at least ${stats.required_songs} songs by ${stats.required_artists} different artists before it can go live.`}
      </p>
    </div>
  )
}

export default function PlaylistPage() {
  const { streamId } = useParams()
  const [choosers, setChoosers] = useState<Chooser[]>([])
  const [stream, setStream] = useState<StreamInfo | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pickerMode, setPickerMode] = useState<PickerMode>('search')
  const [similarSeeds, setSimilarSeeds] = useState<SeedSong[] | null>(null)
  // The picker is always beside the list on large screens; on small ones it takes
  // over the whole screen, opened on demand.
  const [pickerOpen, setPickerOpen] = useState(false)

  const similarAvailable = stream?.playlist?.similar_songs_available ?? false

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = choosers.findIndex((chooser) => chooser.id === active.id)
    const newIndex = choosers.findIndex((chooser) => chooser.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    // Reorder the array
    const newChoosers = arrayMove(choosers, oldIndex, newIndex)
    setChoosers(newChoosers)

    // Calculate new rating based on position
    const draggedChooser = newChoosers[newIndex]
    let newRating: number

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    if (newIndex === 0) {
      if (isFirstPage) {
        // Moving to top of first page - set rating halfway between highest rating and 100
        const nextChooser = newChoosers[1]
        const highestRating = nextChooser?.rating || 0.01
        newRating = (highestRating + 100) / 2
      } else {
        // Moving to top of other pages - take lesser of (highest + 1) and average of (highest and 100)
        const nextChooser = newChoosers[1]
        const highestRating = nextChooser?.rating || 99.99
        const option1 = highestRating + 1
        const option2 = (highestRating + 100) / 2
        newRating = Math.min(option1, option2)
      }
    } else if (newIndex === newChoosers.length - 1) {
      if (isLastPage) {
        // Moving to bottom of last page - set rating halfway between 0 and lowest rating
        const prevChooser = newChoosers[newIndex - 1]
        const lowestRating = prevChooser?.rating || 99.99
        newRating = (0 + lowestRating) / 2
      } else {
        // Moving to bottom of other pages - take greater of (lowest - 1) and average of (lowest and 0)
        const prevChooser = newChoosers[newIndex - 1]
        const lowestRating = prevChooser?.rating || 0.01
        const option1 = lowestRating - 1
        const option2 = lowestRating / 2
        newRating = Math.max(option1, option2)
      }
    } else {
      // If moved to middle, set rating as halfway between adjacent items
      const prevChooser = newChoosers[newIndex - 1]
      const nextChooser = newChoosers[newIndex + 1]
      const prevRating = prevChooser?.rating || 0
      const nextRating = nextChooser?.rating || 0
      newRating = (prevRating + nextRating) / 2
    }

    // Update the backend
    try {
      await api.patch(`/streams/${streamId}/choosers/${draggedChooser.id}`, {
        chooser: { rating: newRating }
      })
      // Refresh the data to show updated ratings
      fetchPlaylist(currentPage)
    } catch (error) {
      console.error(`Failed to reorder song ${draggedChooser.song.id}`, error)
      setNotice(`Failed to update playlist order.`)
      // Revert the change on error
      fetchPlaylist(currentPage)
    }
  }

  const fetchStream = useCallback(async () => {
    if (!streamId) return
    try {
      const response = await api.get<StreamInfo>(`/streams/${streamId}`)
      setStream(response.data)
    } catch (error) {
      console.error(`Failed to fetch stream ${streamId}`, error)
    }
  }, [streamId])

  const fetchPlaylist = useCallback(
    async (page: number = 1) => {
      if (!streamId) return

      try {
        const url = `/streams/${streamId}/choosers?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
        const response = await api.get<any>(url)
        setChoosers(response.data.choosers)
        setTotalPages(response.data.total_pages || 1)
        setTotalItems(response.data.total || 0)
      } catch (error) {
        console.error(`Failed to fetch playlist for stream ${streamId}`, error)
        setNotice('Failed to load the playlist.')
      }
    },
    [streamId]
  )

  const refresh = useCallback(() => {
    fetchStream()
    fetchPlaylist(currentPage)
  }, [fetchStream, fetchPlaylist, currentPage])

  useEffect(() => {
    fetchStream()
  }, [fetchStream])

  useEffect(() => {
    fetchPlaylist(currentPage)
  }, [currentPage, fetchPlaylist])

  const handleDelete = async (chooserId: number) => {
    if (!streamId) return

    try {
      await api.delete(`/streams/${streamId}/choosers/${chooserId}`)
      refresh()
      setNotice(null)
    } catch (error: any) {
      console.error(`Failed to remove song ${chooserId} from playlist`, error)
      setNotice(error.response?.data?.errors?.[0] ?? 'Failed to remove the song.')
    }
  }

  // Adding songs moves on to songs like them, so a playlist grows outwards from
  // the songs you know you want.
  const handleAdd = async (songs: SeedSong[]) => {
    try {
      const response = await api.post<{ added: number[]; total: number }>(
        `/streams/${streamId}/choosers/batch`, { song_ids: songs.map(s => s.id) })
      const added = response.data.added.length
      setNotice(`Added ${added} song${added === 1 ? '' : 's'}.`)
    } catch (error) {
      console.error('Failed to add songs to playlist', error)
      setNotice('Failed to add songs.')
      return false
    } finally {
      refresh()
    }
    if (similarAvailable) {
      setSimilarSeeds(songs)
      setPickerMode('similar')
      return true
    }
    return false
  }

  const findSimilar = (seed: SeedSong) => {
    setSimilarSeeds([seed])
    setPickerMode('similar')
    setPickerOpen(true)
  }

  // On small screens the picker covers the whole page, top bar included, so get
  // it out of the way of the login modal when a request comes back 401.
  useEffect(() => {
    const close = () => setPickerOpen(false)
    window.addEventListener('open-login-modal', close)
    return () => window.removeEventListener('open-login-modal', close)
  }, [])

  const openPicker = (mode: PickerMode) => {
    setPickerMode(mode)
    setPickerOpen(true)
  }

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto p-4 pb-24 lg:pb-4 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-6 lg:items-start">
      <div>
        <h1>{stream ? stream.name : 'Playlist'}</h1>

        {stream && <GoLiveProgress stream={stream} />}

        {notice && <p className="text-sm text-[#8EF7FA]/70 mb-2">{notice}</p>}

        {totalItems === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-700 text-slate-400 text-sm">
            <p className="mb-3">No songs yet. Start with one you love and grow the playlist from there:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <button className="p-0 bg-transparent hover:bg-transparent font-normal text-[#8EF7FA] hover:underline" onClick={() => openPicker('search')}>Search</button>
                {' '}for a song, artist or album and add it.
              </li>
              {similarAvailable && (
                <li>The picker then suggests similar songs — tick the ones you like and keep going.</li>
              )}
              <li>
                Or deal yourself a hand of{' '}
                <button className="p-0 bg-transparent hover:bg-transparent font-normal text-[#8EF7FA] hover:underline" onClick={() => openPicker('random')}>random songs</button>
                {' '}and keep the good ones.
              </li>
            </ol>
          </div>
        ) : (
          <>
            <div className="mb-2 text-sm text-slate-500">
              {totalItems} song{totalItems === 1 ? '' : 's'}, highest rated first — drag to reorder
              {totalPages > 1 && ` (page ${currentPage} of ${totalPages})`}
            </div>

            <div id="playlist">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={choosers.map(chooser => chooser.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {choosers.map((chooser) => (
                    <SortablePlaylistItem
                      key={chooser.id}
                      chooser={chooser}
                      streamId={Number(streamId)}
                      onDelete={handleDelete}
                      onFindSimilar={similarAvailable ? findSimilar : undefined}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <aside className={`${pickerOpen ? '' : 'hidden'} lg:block lg:sticky lg:top-20`}>
        <SongPicker
          streamId={Number(streamId)}
          mode={pickerMode}
          onModeChange={setPickerMode}
          seeds={similarSeeds}
          onSeedsChange={setSimilarSeeds}
          playlistSize={totalItems}
          similarAvailable={similarAvailable}
          onAdd={handleAdd}
          onClose={() => setPickerOpen(false)}
        />
      </aside>

      {!pickerOpen && (
        <button
          onClick={() => setPickerOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-40 px-5 py-3 rounded-full text-sm font-medium bg-slate-800 text-[#8EF7FA] border border-[#8EF7FA]/40 shadow-2xl"
        >
          + Add songs
        </button>
      )}
    </div>
  )
}
