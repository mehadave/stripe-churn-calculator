import { ChurnReport, ManualInput, MRRDataPoint } from './types'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function calculateFromManual(input: ManualInput): ChurnReport {
  const { monthlyMRR, totalCustomers, failedPaymentsPerMonth, cancellationsPerMonth } = input

  const avgSubAmount = totalCustomers > 0 ? monthlyMRR / totalCustomers : 0
  const involuntaryChurnMRR = failedPaymentsPerMonth * avgSubAmount
  const voluntaryChurnMRR = cancellationsPerMonth * avgSubAmount
  const totalLeakedMRR = involuntaryChurnMRR + voluntaryChurnMRR

  const totalChurned = failedPaymentsPerMonth + cancellationsPerMonth
  const churnRate = totalCustomers > 0 ? totalChurned / totalCustomers : 0
  const avgRevenuePerCustomer = avgSubAmount
  const avgLTV = churnRate > 0 ? avgRevenuePerCustomer / churnRate : 0
  const recoveryOpportunity = involuntaryChurnMRR * 0.7

  const mrrTrend = generateSyntheticTrend(monthlyMRR, totalLeakedMRR)

  return {
    totalMRR: monthlyMRR,
    totalCustomers,
    monthsInDataset: 1,
    involuntaryChurnMRR,
    voluntaryChurnMRR,
    totalLeakedMRR,
    churnRate,
    avgLTV,
    avgRevenuePerCustomer,
    recoveryOpportunity,
    mrrTrend,
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

export function calculateFromCSVRows(rows: Record<string, string>[]): ChurnReport {
  const charges = rows.map(row => ({
    amount: parseFloat(row['Amount'] ?? row['amount'] ?? '0'),
    status: (row['Status'] ?? row['status'] ?? '').toLowerCase(),
    created: new Date(row['Created (UTC)'] ?? row['created'] ?? ''),
    customerId: row['Customer ID'] ?? row['customer_id'] ?? '',
  }))

  const validDates = charges.map(c => c.created).filter(d => !isNaN(d.getTime()))
  const monthsInDataset = validDates.length >= 2
    ? Math.max(1, Math.ceil(
        (Math.max(...validDates.map(d => d.getTime())) - Math.min(...validDates.map(d => d.getTime()))) /
        (1000 * 60 * 60 * 24 * 30)
      ))
    : 1

  const failed = charges.filter(c => c.status === 'failed')
  const succeeded = charges.filter(c => c.status === 'succeeded')

  const totalFailedAmount = failed.reduce((s, c) => s + c.amount, 0)
  const totalSucceededAmount = succeeded.reduce((s, c) => s + c.amount, 0)

  const involuntaryChurnMRR = totalFailedAmount / monthsInDataset
  const totalMRR = totalSucceededAmount / monthsInDataset

  const uniqueCustomers = new Set(charges.map(c => c.customerId).filter(Boolean))
  const totalCustomers = Math.max(uniqueCustomers.size, 1)

  const churnRate = charges.length > 0 ? failed.length / charges.length : 0
  const avgRevenuePerCustomer = totalMRR / totalCustomers
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
  }
}

function buildMonthlyTrend(
  charges: { amount: number; status: string; created: Date }[]
): MRRDataPoint[] {
  const byMonth: Record<string, { mrr: number; churned: number }> = {}

  charges.forEach(c => {
    if (isNaN(c.created.getTime())) return
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
