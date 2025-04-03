import { NextApiRequest, NextApiResponse } from 'next'

import { searchAirports } from '../../../models/airport'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { search = '', limit = '50000', page = '1' } = req.query
  const data = await searchAirports(
    search.toString(),
    parseInt(page.toString()),
    parseInt(limit.toString())
  )

  res.status(200).json(data)
}
