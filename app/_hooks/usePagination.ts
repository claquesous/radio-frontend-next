import { useState, useMemo } from 'react'

interface UsePaginationConfig {
  totalItems: number
  pageSize: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  handlePageChange: (page: number) => void
  offset: number
}

export function usePagination({
  totalItems,
  pageSize,
  initialPage = 1
}: UsePaginationConfig): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize))
  }, [totalItems, pageSize])

  const offset = useMemo(() => {
    return (currentPage - 1) * pageSize
  }, [currentPage, pageSize])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    handlePageChange,
    offset
  }
}
