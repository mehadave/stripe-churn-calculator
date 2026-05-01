import Papa from 'papaparse'
import { calculateFromCSVRows, calculateFromSubscriptionsCSV } from './calculations'
import { ChurnReport } from './types'

function detectCSVType(headers: string[]): 'subscriptions' | 'charges' {
  const set = new Set(headers.map(h => h.toLowerCase().trim()))
  if (
    set.has('plan amount') ||
    set.has('plan interval') ||
    set.has('canceled at (utc)')
  ) return 'subscriptions'
  return 'charges'
}

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
          const type = detectCSVType(results.meta.fields ?? [])
          resolve(
            type === 'subscriptions'
              ? calculateFromSubscriptionsCSV(rows)
              : calculateFromCSVRows(rows)
          )
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(new Error(err.message)),
    })
  })
}
