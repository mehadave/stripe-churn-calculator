import Papa from 'papaparse'
import { calculateFromCSVRows } from './calculations'
import { ChurnReport } from './types'

export function parseStripeCSV(file: File): Promise<ChurnReport> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[]
        if (rows.length === 0) {
          reject(new Error('CSV file is empty or has no data rows.'))
          return
        }
        try {
          resolve(calculateFromCSVRows(rows))
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(new Error(err.message)),
    })
  })
}
