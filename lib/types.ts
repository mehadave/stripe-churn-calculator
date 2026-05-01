export interface ChurnReport {
  totalMRR: number
  totalCustomers: number
  monthsInDataset: number
  involuntaryChurnMRR: number
  voluntaryChurnMRR: number
  totalLeakedMRR: number
  churnRate: number
  avgLTV: number
  avgRevenuePerCustomer: number
  recoveryOpportunity: number
  mrrTrend: MRRDataPoint[]
  voluntaryChurnAvailable: boolean
  csvType: 'charges' | 'subscriptions' | 'manual'
}

export interface MRRDataPoint {
  month: string
  mrr: number
  churned: number
}

export interface ManualInput {
  monthlyMRR: number
  totalCustomers: number
  failedPaymentsPerMonth: number
  cancellationsPerMonth: number
}
