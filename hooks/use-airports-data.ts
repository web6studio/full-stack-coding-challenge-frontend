import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'

interface UseAirportsDataResponse<T> {
  data: T
  isLoading: boolean
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>
  isItemLoaded: (index: number) => boolean
}

export const useAirportsData = <T>(
  path: string,
  defaultValue: any,
  pageSize: number,
  dependencies = []
): UseAirportsDataResponse<T> => {
  const [data, setData] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const isItemLoaded = useCallback(
    (index: number) => isLoading || index < (data as any).airports.length,
    [data, isLoading]
  )

  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (isLoading) return

      const nextPage = page + 1
      setIsLoading(true)

      try {
        const response = await axios.get<T>(path, {
          params: { page, limit: pageSize },
        })

        setData((prevData: any) => ({
          ...prevData,
          airports: [...prevData.airports, ...(response.data as any).airports],
          page: nextPage,
        }))

        setPage(nextPage)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [path, page, pageSize, isLoading]
  )

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setPage(1)
    setData(defaultValue)

    axios
      .get<T>(path, {
        params: { page, limit: pageSize },
        signal: controller.signal,
      })
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        if (!axios.isCancel(err) && err) {
          return err.response
        }
      })
      .finally(() => {
        setIsLoading(false)
      })

    return () => controller.abort()
  }, dependencies)

  return { data, isLoading, loadMoreItems, isItemLoaded }
}

export default useAirportsData
