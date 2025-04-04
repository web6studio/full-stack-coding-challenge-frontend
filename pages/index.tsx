import { NextPage } from 'next'
import Link from 'next/link'
import { CSSProperties, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'

import Layout from '../components/layout'
import useAirportsData from '../hooks/use-airports-data'
import AirportResponse from '../types/airportsResponse'
import useDebounce from '../hooks/use-debounce'

const PAGE_SIZE = 50
const ITEM_HEIGHT = 80

const Page: NextPage = () => {
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading, loadMoreItems, isItemLoaded } = useAirportsData<AirportResponse>(
    `/api/airports${debouncedQuery ? `?search=${debouncedQuery}` : ''}`,
    { airports: [], total: 0, page: 1, limit: PAGE_SIZE },
    PAGE_SIZE,
    [debouncedQuery]
  )

  const AirportRow = ({ index, style }: { index: number; style: CSSProperties }) => {
    const airport = data.airports[index]
    const isLoaded = isItemLoaded(index)

    if (!isLoaded) {
      return <div style={style}>Loading...</div>
    }

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
      <h1 className="text-2xl font-bold mb-6">Code Challenge: Airports</h1>

      <div className="mt-1 relative shadow-sm">
        <input
          type="text"
          name="query"
          id="query"
          className="border border-gray-200 focus:ring-blue-600 block w-full sm:text-sm text-gray-800 rounded bg-gray-50 p-3"
          placeholder="Start typing..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-8 flex items-center">
        <h2 className="text-xl font-bold">Airports</h2>
        <span className="text-white rounded-full bg-blue-500 py-0.5 px-2 ml-2">{data.total}</span>
      </div>

      <div style={{ height: 'calc(100vh - 230px)' }}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={data.total}
              loadMoreItems={loadMoreItems}
              threshold={5}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  height={height}
                  itemCount={data.airports.length}
                  itemSize={ITEM_HEIGHT}
                  width={width}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                >
                  {AirportRow}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </Layout>
  )
}

export default Page
