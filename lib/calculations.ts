import { ChurnReport, ManualInput, MRRDataPoint } from './types'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Shared helpers ───────────────────────────────────────────────────────────

// Count distinct calendar months (Jan 2024, Feb 2024 → 2)
function countDistinctMonths(dates: Date[]): number {
  if (dates.length === 0) return 1
  const months = new Set(dates.map(d => `${d.getFullYear()}-${d.getMonth()}`))
  return Math.max(months.size, 1)
}

// Median-based heuristic: if median non-zero value > 500, amounts are in cents
function detectDivisor(amounts: number[]): number {
  const nonZero = amounts.filter(a => a > 0)
  if (!nonZero.length) return 1
  const median = nonZero.slice().sort((a, b) => a - b)[Math.floor(nonZero.length / 2)]
  return median > 500 ? 100 : 1
}

// Normalize a subscription amount to monthly MRR
// Stripe Plan Interval: day | week | month | year; Plan Interval Count: 1, 3, 6, 12 etc.
function toMonthlyAmount(amount: number, interval: string, intervalCount: number): number {
  const count = Math.max(intervalCount || 1, 1)
  switch (interval) {
    case 'year':  return amount / (count * 12)
    case 'month': return amount / count
    case 'week':  return (amount / count) * (52 / 12)
    case 'day':   return (amount / count) * (365 / 12)
    default:      return amount
  }
}

// ─── Manual entry path ────────────────────────────────────────────────────────

export function calculateFromManual(input: ManualInput): ChurnReport {
  const { monthlyMRR, totalCustomers, failedPaymentsPerMonth, cancellationsPerMonth } = input

  const avgSubAmount = totalCustomers > 0 ? monthlyMRR / totalCustomers : 0
  const involuntaryChurnMRR = failedPaymentsPerMonth * avgSubAmount
  const voluntaryChurnMRR = cancellationsPerMonth * avgSubAmount
  const totalLeakedMRR = involuntaryChurnMRR + voluntaryChurnMRR

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
    csvType: 'manual',
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

// ─── Charges CSV path ─────────────────────────────────────────────────────────

export function calculateFromCSVRows(rows: Record<string, string>[]): ChurnReport {
  const rawCharges = rows.map(row => ({
    rawAmount: parseFloat(row['Amount'] ?? row['amount'] ?? '0'),
    status: (row['Status'] ?? row['status'] ?? '').toLowerCase(),
    created: new Date(row['Created (UTC)'] ?? row['created'] ?? ''),
    customerId: row['Customer ID'] ?? row['customer_id'] ?? '',
  }))

  const divisor = detectDivisor(rawCharges.map(c => c.rawAmount))
  const charges = rawCharges.map(c => ({ ...c, amount: c.rawAmount / divisor }))

  const validDates = charges.map(c => c.created).filter(d => !isNaN(d.getTime()))
  const monthsInDataset = countDistinctMonths(validDates)

  const failed = charges.filter(c => c.status === 'failed')
  const succeeded = charges.filter(c => c.status === 'succeeded')

  const totalFailedAmount = failed.reduce((s, c) => s + c.amount, 0)
  const totalSucceededAmount = succeeded.reduce((s, c) => s + c.amount, 0)

  const involuntaryChurnMRR = totalFailedAmount / monthsInDataset
  const totalMRR = totalSucceededAmount / monthsInDataset

  const uniqueCustomers = new Set(charges.map(c => c.customerId).filter(Boolean))
  const totalCustomers = Math.max(uniqueCustomers.size, 1)

  // Proxy: unique customers with a failed charge / total unique customers
  const uniqueFailedCustomers = new Set(failed.map(c => c.customerId).filter(Boolean))
  const churnRate = uniqueFailedCustomers.size > 0
    ? uniqueFailedCustomers.size / totalCustomers
    : failed.length / Math.max(charges.length, 1)

  const avgRevenuePerCustomer = totalMRR / totalCustomers
  const avgLTV = churnRate > 0 ? avgRevenuePerCustomer / churnRate : 0

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
    recoveryOpportunity: involuntaryChurnMRR * 0.7,
    mrrTrend: buildChargesTrend(charges),
    voluntaryChurnAvailable: false,
    csvType: 'charges',
  }
}

function buildChargesTrend(
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

// ─── Subscriptions CSV path ───────────────────────────────────────────────────

interface ParsedSub {
  customerId: string
  status: string
  created: Date
  canceledAt: Date | null
  normalizedMRR: number
}

export function calculateFromSubscriptionsCSV(rows: Record<string, string>[]): ChurnReport {
  const rawSubs = rows.map(row => ({
    customerId: row['Customer ID'] ?? row['customer_id'] ?? '',
    status: (row['Status'] ?? row['status'] ?? '').toLowerCase(),
    created: new Date(row['Created (UTC)'] ?? row['created'] ?? ''),
    canceledAt: row['Canceled At (UTC)'] ? new Date(row['Canceled At (UTC)']) : null,
    planAmount: parseFloat(row['Plan Amount'] ?? row['plan_amount'] ?? '0'),
    planInterval: (row['Plan Interval'] ?? row['plan_interval'] ?? 'month').toLowerCase(),
    planIntervalCount: parseInt(row['Plan Interval Count'] ?? row['plan_interval_count'] ?? '1') || 1,
    quantity: parseInt(row['Quantity'] ?? row['quantity'] ?? '1') || 1,
  }))

  // Subscriptions CSV Plan Amount is always in cents (Stripe's minor unit)
  const divisor = detectDivisor(rawSubs.map(s => s.planAmount))

  const subs: ParsedSub[] = rawSubs.map(s => ({
    customerId: s.customerId,
    status: s.status,
    created: s.created,
    canceledAt: s.canceledAt,
    normalizedMRR: toMonthlyAmount(
      (s.planAmount / divisor) * s.quantity,
      s.planInterval,
      s.planIntervalCount
    ),
  }))

  const active    = subs.filter(s => s.status === 'active' || s.status === 'trialing')
  const canceled  = subs.filter(s => s.status === 'canceled')
  const atRisk    = subs.filter(s => s.status === 'past_due' || s.status === 'unpaid')

  const totalMRR = active.reduce((sum, s) => sum + s.normalizedMRR, 0)

  // Months in dataset: from earliest creation to now
  const validCreated = subs.map(s => s.created).filter(d => !isNaN(d.getTime()))
  const monthsInDataset = countDistinctMonths(validCreated)

  // Voluntary churn: avg monthly MRR lost to cancellations
  const totalCanceledMRR = canceled.reduce((sum, s) => sum + s.normalizedMRR, 0)
  const voluntaryChurnMRR = totalCanceledMRR / monthsInDataset

  // Involuntary churn: current MRR at risk from past_due / unpaid subscriptions
  const involuntaryChurnMRR = atRisk.reduce((sum, s) => sum + s.normalizedMRR, 0)

  const totalLeakedMRR = voluntaryChurnMRR + involuntaryChurnMRR

  const uniqueCustomers = new Set(subs.map(s => s.customerId).filter(Boolean))
  const totalCustomers = Math.max(uniqueCustomers.size, 1)

  // Monthly churn rate = avg cancellations per month / active count
  const monthlyChurnRate = active.length > 0
    ? (canceled.length / monthsInDataset) / active.length
    : 0

  const avgRevenuePerCustomer = totalMRR / Math.max(active.length, 1)
  const avgLTV = monthlyChurnRate > 0 ? avgRevenuePerCustomer / monthlyChurnRate : 0

  return {
    totalMRR,
    totalCustomers,
    monthsInDataset,
    involuntaryChurnMRR,
    voluntaryChurnMRR,
    totalLeakedMRR,
    churnRate: monthlyChurnRate,
    avgLTV,
    avgRevenuePerCustomer,
    recoveryOpportunity: involuntaryChurnMRR * 0.7,
    mrrTrend: buildSubscriptionTrend(subs),
    voluntaryChurnAvailable: true,
    csvType: 'subscriptions',
  }
}

// True historical MRR trend — checks subscription active state per month
function buildSubscriptionTrend(subs: ParsedSub[]): MRRDataPoint[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const monthsAgo = 5 - i
    const monthStart = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59)

    let mrr = 0
    let churned = 0

    subs.forEach(s => {
      if (isNaN(s.created.getTime()) || s.created > monthEnd) return
      const isActive = !s.canceledAt || s.canceledAt > monthStart
      if (isActive) mrr += s.normalizedMRR
      if (s.canceledAt && s.canceledAt >= monthStart && s.canceledAt <= monthEnd) {
        churned += s.normalizedMRR
      }
    })

    return { month: MONTH_NAMES[monthStart.getMonth()], mrr: Math.round(mrr), churned: Math.round(churned) }
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
