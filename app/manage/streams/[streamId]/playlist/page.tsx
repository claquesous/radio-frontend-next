'use client'

import { useCallback, useEffect, useState } from 'react'
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

type TabType = 'included' | 'available' | 'newest'

interface SortableChooserItemProps {
  chooser: Chooser
  streamId: number
  onDelete: (chooserId: number) => void
}

interface SongItemProps {
  song: any
  streamId: number
  onAdd: (songId: number) => void
}

function RowActions({ chooser, streamId, onDelete }: SortableChooserItemProps) {
  return (
    <div
      className="flex gap-2"
      onPointerDown={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
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

function SongRowActions({ song, streamId, onAdd, onDelete }: SongItemProps & { onDelete?: (chooserId: number) => void }) {
  return (
    <div className="flex gap-2">
      {song.included && song.chooser_id && onDelete ? (
        <DeleteButton
          onClick={() => onDelete(song.chooser_id)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
          title="Remove from playlist"
        />
      ) : (
        <button
          onClick={() => onAdd(song.id)}
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
          title="Add to playlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16" fill="#ffffff">
            <path d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"/>
          </svg>
        </button>
      )}
    </div>
  )
}

function SortableChooserItem({ chooser, streamId, onDelete }: SortableChooserItemProps) {
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
      <div className="flex flex-row items-center w-full pl-0 sm:pl-10 gap-2 sm:gap-4">
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
        <RowActions chooser={chooser} streamId={streamId} onDelete={onDelete} />
      </div>
    </div>
  )
}

function SongItem({ song, streamId, onAdd, onDelete }: SongItemProps & { onDelete?: (chooserId: number) => void }) {
  return (
    <div className="relative border-b py-2">
      <div className="flex flex-row items-center w-full gap-2 sm:gap-4">
        <div className="flex-1">
          <h3 className="font-medium">{song.title}</h3>
          <p className="text-sm text-gray-600">{song.artist?.name}</p>
        </div>
        <SongRowActions song={song} streamId={streamId} onAdd={onAdd} onDelete={onDelete} />
      </div>
    </div>
  )
}

export default function ChoosersIndexPage() {
  const { streamId } = useParams()
  const [choosers, setChoosers] = useState<Chooser[]>([])
  const [availableSongs, setAvailableSongs] = useState<any[]>([])
  const [newSongs, setNewSongs] = useState<any[]>([])
  const [stream, setStream] = useState<any>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('included')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

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
      setNotice(`Playlist order updated successfully!`)
      // Refresh the data to show updated ratings
      fetchData(activeTab, currentPage)
    } catch (error) {
      console.error(`Failed to update chooser ${draggedChooser.id}`, error)
      setNotice(`Failed to update playlist order.`)
      // Revert the change on error
      fetchData(activeTab, currentPage)
    }
  }

  const fetchData = useCallback(
    async (tab: TabType, page: number = 1) => {
      if (!streamId) return

      try {
        // Always fetch stream info for default_rating
        const streamResp = await api.get<any>(`/streams/${streamId}`)
        setStream(streamResp.data)

        if (tab === 'included') {
          const url = `/streams/${streamId}/choosers?limit=50&offset=${(page - 1) * 50}`
          const response = await api.get<any>(url)
          if (response.data.choosers) {
            setChoosers(response.data.choosers)
            setTotalPages(response.data.total_pages || 1)
            setTotalItems(response.data.total || 0)
          } else {
            setChoosers(response.data)
            setTotalPages(1)
            setTotalItems(response.data.length)
          }
        } else if (tab === 'available') {
          const url = `/streams/${streamId}/available_songs?limit=50&offset=${(page - 1) * 50}`
          const response = await api.get<any>(url)
          // If paginated, expect { songs: [...], pagination: {...} }
          setAvailableSongs(response.data.songs)
          setTotalPages(Math.ceil(response.data.total / 50))
          setTotalItems(response.data.total)
        } else if (tab === 'newest') {
          const resp = await api.get<any>(`/streams/${streamId}/new_songs_with_included`)
          setNewSongs(resp.data)
          setTotalPages(1)
          setTotalItems(resp.data.length)
        }

        setNotice(`Playlist for Stream ${streamId} loaded successfully!`)
      } catch (error) {
        console.error(`Failed to fetch playlist for stream ${streamId}`, error)
        setNotice(`Failed to load playlist for stream ${streamId}.`)
      }
    },
    [streamId]
  )

  useEffect(() => {
    setCurrentPage(1)
    fetchData(activeTab, 1)
  }, [streamId, activeTab, fetchData])

  useEffect(() => {
    if (activeTab !== 'newest') {
      fetchData(activeTab, currentPage)
    }
  }, [currentPage, activeTab, fetchData])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async (chooserId: number) => {
    if (!streamId) return

    try {
      await api.delete(`/streams/${streamId}/choosers/${chooserId}`)
      // Refresh the current tab data
      fetchData(activeTab, currentPage)
      setNotice(`Removed from playlist successfully!`)
    } catch (error) {
      console.error(`Failed to remove playlist chooser ${chooserId}`, error)
      setNotice(`Failed to remove playlist chooser.`)
    }
  }

  const handleAdd = async (songId: number) => {
    if (!streamId || !stream) return

    try {
      const defaultRating = stream.default_rating ?? 50
      await api.post(`/streams/${streamId}/choosers`, {
        chooser: { song_id: songId, rating: defaultRating }
      })
      fetchData(activeTab, currentPage)
      setNotice(`Added to playlist successfully!`)
    } catch (error) {
      console.error(`Failed to add song ${songId} to playlist`, error)
      setNotice(`Failed to add song to playlist.`)
    }
  }

  const renderPagination = () => {
    if (activeTab === 'newest' || totalPages <= 1) return null

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    )
  }

  const renderContent = () => {
    if (activeTab === 'included') {
      return (
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
              <SortableChooserItem
                key={chooser.id}
                chooser={chooser}
                streamId={Number(streamId)}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )
    } else if (activeTab === 'available') {
      return availableSongs.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          streamId={Number(streamId)}
          onAdd={handleAdd}
        />
      ))
    } else {
      // newest tab
      return newSongs.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          streamId={Number(streamId)}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {notice && <p style={{ color: 'green' }}>{notice}</p>}

      <h1>Playlist for Stream {streamId}</h1>

      <div className="tabs mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'included'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTabChange('included')}
        >
          Included
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'available'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTabChange('available')}
        >
          Available
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'newest'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTabChange('newest')}
        >
          New
        </button>
      </div>

      {(activeTab === 'included' || activeTab === 'available') && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {activeTab === 'available' ? availableSongs.length : choosers.length} of {totalItems} {activeTab === 'available' ? 'songs' : 'choosers'}
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
      )}

      <div id="choosers">
        {renderContent()}
      </div>

      {renderPagination()}
    </div>
  )
}
