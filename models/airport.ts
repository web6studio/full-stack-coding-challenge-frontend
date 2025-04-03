import airports from '../data/airports.json'
import Airport from '../types/airport'

export const findAirportByIata = async (iata: string): Promise<Airport | undefined> => {
  return airports.find((airport) => airport.iata === iata.toUpperCase())
}

export const allAirports = async (): Promise<Airport[]> => {
  return airports
}

const normalizeString = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const searchAirports = async (
  query: string,
  page: number = 1,
  limit: number = 50
): Promise<Airport[]> => {
  const regex = new RegExp(normalizeString(query), 'i')

  const filteredAirports = airports.filter(
    (airport) =>
      regex.test(airport.iata) ||
      regex.test(normalizeString(airport.name)) ||
      regex.test(airport.city) ||
      regex.test(airport.country)
  )

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return filteredAirports.slice(startIndex, endIndex)
}
