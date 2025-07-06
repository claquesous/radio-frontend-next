import { useState, useEffect, useCallback } from 'react'

interface PaginatedResponse<T> {
  data: T[]
  total: number
}

interface UsePaginatedDataConfig<T> {
  fetchFunction: (limit: number, offset: number) => Promise<PaginatedResponse<T>>
  pageSize: number
}

interface UsePaginatedDataReturn<T> {
  data: T[]
  totalItems: number
  loading: boolean
  error: string | null
  fetchPage: (offset: number) => void
  refetch: () => void
}

export function usePaginatedData<T>({
  fetchFunction,
  pageSize
}: UsePaginatedDataConfig<T>): UsePaginatedDataReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (offset: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFunction(pageSize, offset)
      setData(result.data)
      setTotalItems(result.total)
    } catch (err) {
      console.error('Failed to fetch data', err)
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, pageSize])

  const fetchPage = useCallback((offset: number) => {
    fetchData(offset)
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData(0)
  }, [fetchData])

  useEffect(() => {
    fetchData(0)
  }, [fetchData])

  return {
    data,
    totalItems,
    loading,
    error,
    fetchPage,
    refetch
  }
}
