import { ChurnReport, ManualInput, MRRDataPoint } from './types'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Manual entry path ────────────────────────────────────────────────────────

export function calculateFromManual(input: ManualInput): ChurnReport {
  const { monthlyMRR, totalCustomers, failedPaymentsPerMonth, cancellationsPerMonth } = input

  const avgSubAmount = totalCustomers > 0 ? monthlyMRR / totalCustomers : 0
  const involuntaryChurnMRR = failedPaymentsPerMonth * avgSubAmount
  const voluntaryChurnMRR = cancellationsPerMonth * avgSubAmount
  const totalLeakedMRR = involuntaryChurnMRR + voluntaryChurnMRR

  // Customer churn rate: churned customers / total customers (monthly)
  const churned = failedPaymentsPerMonth + cancellationsPerMonth
  const churnRate = totalCustomers > 0 ? churned / totalCustomers : 0

  const avgLTV = churnRate > 0 ? avgSubAmount / churnRate : 0
  const recoveryOpportunity = involuntaryChurnMRR * 0.7

  return {
    totalMRR: monthlyMRR,
    totalCustomers,
    monthsInDataset: 1,
    involuntaryChurnMRR,
    voluntaryChurnMRR,
    totalLeakedMRR,
    churnRate,
    avgLTV,
    avgRevenuePerCustomer: avgSubAmount,
    recoveryOpportunity,
    mrrTrend: generateSyntheticTrend(monthlyMRR, totalLeakedMRR),
    voluntaryChurnAvailable: true,
  }
}

function generateSyntheticTrend(currentMRR: number, monthlyLeak: number): MRRDataPoint[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const monthsAgo = 5 - i
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    const mrr = Math.max(0, currentMRR + monthlyLeak * (monthsAgo - 2.5))
    return { month: MONTH_NAMES[d.getMonth()], mrr: Math.round(mrr), churned: Math.round(monthlyLeak) }
  })
}

// ─── CSV path ─────────────────────────────────────────────────────────────────

export function calculateFromCSVRows(rows: Record<string, string>[]): ChurnReport {
  const rawCharges = rows.map(row => ({
    rawAmount: parseFloat(row['Amount'] ?? row['amount'] ?? '0'),
    currency: (row['Currency'] ?? row['currency'] ?? 'usd').toLowerCase(),
    status: (row['Status'] ?? row['status'] ?? '').toLowerCase(),
    created: new Date(row['Created (UTC)'] ?? row['created'] ?? ''),
    customerId: row['Customer ID'] ?? row['customer_id'] ?? '',
  }))

  // Detect if amounts are in minor units (cents).
  // Stripe Dashboard CSV exports dollars; Stripe API / balance-transaction exports use cents.
  // Heuristic: if the median non-zero amount > 500, assume cents and divide by 100.
  const nonZero = rawCharges.map(c => c.rawAmount).filter(a => a > 0)
  const median = nonZero.length
    ? nonZero.slice().sort((a, b) => a - b)[Math.floor(nonZero.length / 2)]
    : 0
  const amountDivisor = median > 500 ? 100 : 1

  const charges = rawCharges.map(c => ({ ...c, amount: c.rawAmount / amountDivisor }))

  // Count distinct calendar months instead of using 30-day approximation
  const validDates = charges.map(c => c.created).filter(d => !isNaN(d.getTime()))
  const monthsInDataset = countDistinctMonths(validDates)

  const failed = charges.filter(c => c.status === 'failed')
  const succeeded = charges.filter(c => c.status === 'succeeded')

  const totalFailedAmount = failed.reduce((s, c) => s + c.amount, 0)
  const totalSucceededAmount = succeeded.reduce((s, c) => s + c.amount, 0)

  const involuntaryChurnMRR = totalFailedAmount / monthsInDataset
  // Average monthly revenue (not strict MRR — charges CSV includes one-time charges too)
  const totalMRR = totalSucceededAmount / monthsInDataset

  const uniqueCustomers = new Set(charges.map(c => c.customerId).filter(Boolean))
  const totalCustomers = Math.max(uniqueCustomers.size, 1)

  // Customer churn rate: unique customers with a failed charge / total unique customers
  // This is a proxy — charges CSV has no cancellation data
  const uniqueFailedCustomers = new Set(failed.map(c => c.customerId).filter(Boolean))
  const churnRate = uniqueFailedCustomers.size > 0
    ? uniqueFailedCustomers.size / totalCustomers
    : failed.length / Math.max(charges.length, 1)

  const avgRevenuePerCustomer = totalMRR / totalCustomers
  // LTV = ARPU / monthly churn rate (standard SaaS formula)
  const avgLTV = churnRate > 0 ? avgRevenuePerCustomer / churnRate : 0
  const recoveryOpportunity = involuntaryChurnMRR * 0.7

  return {
    totalMRR,
    totalCustomers,
    monthsInDataset,
    involuntaryChurnMRR,
    voluntaryChurnMRR: 0,
    totalLeakedMRR: involuntaryChurnMRR,
    churnRate,
    avgLTV,
    avgRevenuePerCustomer,
    recoveryOpportunity,
    mrrTrend: buildMonthlyTrend(charges),
    // Charges CSV has no cancellation data — voluntary churn unavailable
    voluntaryChurnAvailable: false,
  }
}

// Count distinct calendar months (e.g. Jan 2024, Feb 2024 = 2 months)
function countDistinctMonths(dates: Date[]): number {
  if (dates.length === 0) return 1
  const months = new Set(dates.map(d => `${d.getFullYear()}-${d.getMonth()}`))
  return Math.max(months.size, 1)
}

function buildMonthlyTrend(
  charges: { amount: number; status: string; created: Date }[]
): MRRDataPoint[] {
  const byMonth: Record<string, { mrr: number; churned: number }> = {}

  charges.forEach(c => {
    if (isNaN(c.created.getTime())) return
    // Zero-pad month so lexicographic sort == chronological sort
    const key = `${c.created.getFullYear()}-${String(c.created.getMonth()).padStart(2, '0')}`
    if (!byMonth[key]) byMonth[key] = { mrr: 0, churned: 0 }
    if (c.status === 'succeeded') byMonth[key].mrr += c.amount
    if (c.status === 'failed') byMonth[key].churned += c.amount
  })

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, val]) => {
      const month = parseInt(key.split('-')[1])
      return { month: MONTH_NAMES[month], mrr: Math.round(val.mrr), churned: Math.round(val.churned) }
    })
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}
