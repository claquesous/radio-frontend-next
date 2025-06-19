'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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

import { Chooser } from '../../../../_types/types'
import api from '../../../../../lib/api'

type TabType = 'featured' | 'non-featured' | 'newest'

interface SortableChooserItemProps {
  chooser: Chooser
  streamId: number
  onDelete: (chooserId: number) => void
  onAdd: (chooserId: number) => void
}

function SortableChooserItem({ chooser, streamId, onDelete, onAdd }: SortableChooserItemProps) {
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
      {...listeners}
      className="relative cursor-move"
    >
      <ChooserCard chooser={chooser} streamId={streamId} />
      <div
        className="absolute top-2 right-2 flex gap-2"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Enqueue streamId={streamId} songId={chooser.song.id} />
        {chooser.featured ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(chooser.id)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
            title="Remove from playlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Trash-Can--Streamline-Font-Awesome" height="16" width="16">
              <desc>
                Trash Can Streamline Icon: https://streamlinehq.com
              </desc>
              <path d="M5.2805 0.7020642857142857C5.445875 0.36824999999999997 5.785814285714285 0.16 6.156375 0.16h3.6872499999999997c0.3705642857142857 0 0.7104999999999999 0.20825 0.875875 0.5420642857142857L10.94 1.14h2.9399999999999995c0.5420607142857142 0 0.98 0.4379392857142857 0.98 0.98S14.422060714285713 3.0999999999999996 13.879999999999999 3.0999999999999996H2.1199999999999997c-0.5420642857142857 0 -0.98 -0.43793571428571426 -0.98 -0.98s0.43793571428571426 -0.98 0.98 -0.98h2.9399999999999995l0.2205 -0.43793571428571426ZM2.1199999999999997 4.079999999999999h11.759999999999998v9.799999999999999c0 1.0810607142857143 -0.8789392857142856 1.96 -1.96 1.96H4.079999999999999c-1.0810642857142856 0 -1.96 -0.8789392857142856 -1.96 -1.96v-9.799999999999999Zm2.9399999999999995 1.96c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Zm2.9399999999999995 0c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Zm2.9399999999999995 0c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Z" fill="#ffffff" stroke-width="0.0357"></path>
            </svg>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdd(chooser.id)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
            title="Add to playlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16" fill="#ffffff">
              <path d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function ChoosersIndexPage() {
  const { streamId } = useParams()
  const [choosers, setChoosers] = useState<Chooser[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalChoosers, setTotalChoosers] = useState(0)

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
      fetchChoosers(activeTab, currentPage)
    } catch (error) {
      console.error(`Failed to update chooser ${draggedChooser.id}`, error)
      setNotice(`Failed to update playlist order.`)
      // Revert the change on error
      fetchChoosers(activeTab, currentPage)
    }
  }

  const fetchChoosers = async (tab: TabType, page: number = 1) => {
    if (!streamId) return

    try {
      let url = `/streams/${streamId}/choosers`
      const params = new URLSearchParams()

      switch (tab) {
        case 'featured':
          params.append('featured', 'true')
          params.append('limit', '50')
          params.append('offset', ((page - 1) * 50).toString())
          break
        case 'non-featured':
          params.append('featured', 'false')
          params.append('limit', '50')
          params.append('offset', ((page - 1) * 50).toString())
          break
        case 'newest':
          params.append('sort', 'created_at')
          params.append('limit', '25')
          break
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await api.get<any>(url)

      // Handle both paginated and non-paginated responses
      if (response.data.choosers) {
        // Paginated response
        setChoosers(response.data.choosers)
        setTotalPages(response.data.total_pages || 1)
        setTotalChoosers(response.data.total || 0)
      } else {
        // Non-paginated response (for newest tab)
        setChoosers(response.data)
        setTotalPages(1)
        setTotalChoosers(response.data.length)
      }

      setNotice(`Playlist for Stream ${streamId} loaded successfully!`)
    } catch (error) {
      console.error(`Failed to fetch playlist for stream ${streamId}`, error)
      setNotice(`Failed to load playlist for stream ${streamId}.`)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchChoosers(activeTab, 1)
  }, [streamId, activeTab])

  useEffect(() => {
    if (activeTab !== 'newest') {
      fetchChoosers(activeTab, currentPage)
    }
  }, [currentPage])

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
      await api.patch(`/streams/${streamId}/choosers/${chooserId}`, {
        chooser: { featured: false }
      })
      // Refresh the current tab data
      fetchChoosers(activeTab, currentPage)
      setNotice(`Removed from playlist successfully!`)
    } catch (error) {
      console.error(`Failed to remove playlist chooser ${chooserId}`, error)
      setNotice(`Failed to remove playlist chooser.`)
    }
  }

  const handleAdd = async (chooserId: number) => {
    if (!streamId) return

    try {
      await api.patch(`/streams/${streamId}/choosers/${chooserId}`, {
        chooser: { featured: true }
      })
      // Refresh the current tab data
      fetchChoosers(activeTab, currentPage)
      setNotice(`Added to playlist successfully!`)
    } catch (error) {
      console.error(`Failed to add playlist chooser ${chooserId}`, error)
      setNotice(`Failed to add playlist chooser.`)
    }
  }

  const renderPagination = () => {
    if (activeTab === 'newest' || totalPages <= 1) return null

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
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            className={`px-3 py-2 rounded ${
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
              className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {notice && <p style={{ color: 'green' }}>{notice}</p>}

      <h1>Playlist for Stream {streamId}</h1>

      <div className="tabs mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'featured'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTabChange('featured')}
        >
          Included
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'non-featured'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTabChange('non-featured')}
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

      {(activeTab === 'featured' || activeTab === 'non-featured') && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {choosers.length} of {totalChoosers} choosers
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
      )}

      <div id="choosers">
        {activeTab === 'featured' ? (
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
                  onAdd={handleAdd}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          choosers.map((chooser) => (
            <div key={chooser.id} className="relative">
              <ChooserCard chooser={chooser} streamId={Number(streamId)} />
              <div className="absolute top-2 right-2 flex gap-2">
                <Enqueue streamId={Number(streamId)} songId={chooser.song.id} />
                {chooser.featured ? (
                  <button
                    onClick={() => handleDelete(chooser.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="Remove from playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Trash-Can--Streamline-Font-Awesome" height="16" width="16">
                      <desc>
                        Trash Can Streamline Icon: https://streamlinehq.com
                      </desc>
                      <path d="M5.2805 0.7020642857142857C5.445875 0.36824999999999997 5.785814285714285 0.16 6.156375 0.16h3.6872499999999997c0.3705642857142857 0 0.7104999999999999 0.20825 0.875875 0.5420642857142857L10.94 1.14h2.9399999999999995c0.5420607142857142 0 0.98 0.4379392857142857 0.98 0.98S14.422060714285713 3.0999999999999996 13.879999999999999 3.0999999999999996H2.1199999999999997c-0.5420642857142857 0 -0.98 -0.43793571428571426 -0.98 -0.98s0.43793571428571426 -0.98 0.98 -0.98h2.9399999999999995l0.2205 -0.43793571428571426ZM2.1199999999999997 4.079999999999999h11.759999999999998v9.799999999999999c0 1.0810607142857143 -0.8789392857142856 1.96 -1.96 1.96H4.079999999999999c-1.0810642857142856 0 -1.96 -0.8789392857142856 -1.96 -1.96v-9.799999999999999Zm2.9399999999999995 1.96c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Zm2.9399999999999995 0c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Zm2.9399999999999995 0c-0.2695 0 -0.49 0.2205 -0.49 0.49v6.86c0 0.2695 0.2205 0.49 0.49 0.49s0.49 -0.2205 0.49 -0.49V6.529999999999999c0 -0.2695 -0.2205 -0.49 -0.49 -0.49Z" fill="#ffffff" stroke-width="0.0357"></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(chooser.id)}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    title="Add to playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16" fill="#ffffff">
                      <path d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {renderPagination()}
    </div>
  )
}
