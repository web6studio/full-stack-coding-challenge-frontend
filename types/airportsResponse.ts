import Airport from './airport'

interface AirportResponse {
  airports: Airport[]
  total: number
  page: number
  limit: number
}

export default AirportResponse
