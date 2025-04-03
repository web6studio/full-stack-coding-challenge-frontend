import axios from 'axios'
import { useEffect, useState } from 'react'

export const useApiData = <T>(path: string, defaultValue: any, dependencies = []): T => {
  const [data, setData] = useState<T>(defaultValue)

  useEffect(() => {
    const controller = new AbortController()

    axios
      .get<T>(path, {
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

    return () => controller.abort()
  }, dependencies)

  return data
}

export default useApiData
