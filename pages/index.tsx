import { NextPage } from 'next'
import Link from 'next/link'
import { CSSProperties, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import Layout from '../components/layout'
import useApiData from '../hooks/use-api-data'
import AirportResponse from '../types/airportsResponse'
import useDebounce from '../hooks/use-debounce'

const PAGE_SIZE = 50000
const ITEM_HEIGHT = 80

const Page: NextPage = () => {
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300)
  const data = useApiData<AirportResponse>(
    `/api/airports${debouncedQuery ? `?search=${debouncedQuery}` : ''}`,
    { airports: [], total: 0, page: 1, limit: PAGE_SIZE },
    [debouncedQuery]
  )

  const AirportRow = ({ index, style }: { index: number; style: CSSProperties }) => {
    const airport = data.airports[index]

    return (
      <div style={style}>
        <Link
          className="flex items-center p-5 mt-5 text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:border-blue-600 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:outline-none"
          href={`/airports/${airport.iata.toLowerCase()}`}
          key={airport.iata}
        >
          <span>
            {airport.name}, {airport.city}
          </span>
          <span className="ml-auto text-gray-500">{airport.country}</span>
        </Link>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Code Challenge: Airports</h1>

      <h2 className="mt-10 text-xl font-semibold">All Airports</h2>

      <div className="mt-1 relative shadow-sm">
        <input
          type="text"
          name="query"
          id="query"
          className="focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 text-gray-800 rounded bg-gray-50 p-3"
          placeholder="Search by name, IATA, city, or country"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ height: 'calc(100vh - 230px)' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={data.airports.length}
              itemSize={ITEM_HEIGHT}
              width={width}
            >
              {AirportRow}
            </List>
          )}
        </AutoSizer>
      </div>
    </Layout>
  )
}

export default Page
