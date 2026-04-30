'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ChurnReport } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/calculations'
import MetricCard from './MetricCard'
import CTABanner from './CTABanner'

const MRRChart = dynamic(() => import('./MRRChart'), { ssr: false })

interface LeakReportProps {
  report: ChurnReport
}

export default function LeakReport({ report }: LeakReportProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `I just found out I'm leaking ${formatCurrency(report.totalLeakedMRR)}/month in MRR. Calculated with stripe-churn-calculator on GitHub.`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5c] px-8 py-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">You&apos;re leaking</p>
            <p className="text-[#FF4D4F] text-6xl sm:text-7xl font-black leading-none tracking-tight">
              {formatCurrency(report.totalLeakedMRR)}
            </p>
            <p className="text-gray-300 text-base mt-2">per month in MRR</p>
          </div>
          <button
            onClick={handleShare}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
        <div className="px-8 py-4 bg-[#F6F9FC] border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Based on <span className="font-semibold text-[#1A1F36]">{report.totalCustomers} customers</span> and{' '}
            <span className="font-semibold text-[#1A1F36]">{report.monthsInDataset} month{report.monthsInDataset !== 1 ? 's' : ''}</span> of data
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Failed payments"
          value={formatCurrency(report.involuntaryChurnMRR)}
          subtitle="per month · recoverable"
          variant="danger"
        />
        <MetricCard
          label="Voluntary churn"
          value={formatCurrency(report.voluntaryChurnMRR)}
          subtitle="per month · cancellations"
          variant={report.voluntaryChurnMRR > 0 ? 'danger' : 'default'}
        />
        <MetricCard
          label="Churn rate"
          value={formatPercent(report.churnRate)}
          subtitle="monthly"
          variant={report.churnRate > 0.05 ? 'danger' : 'default'}
        />
        <MetricCard
          label="Avg customer LTV"
          value={report.avgLTV > 0 ? formatCurrency(report.avgLTV) : '—'}
          subtitle="at current churn"
        />
      </div>

      {/* Chart */}
      {report.mrrTrend.length > 0 && <MRRChart data={report.mrrTrend} />}

      {/* Recovery card */}
      <div className="bg-white rounded-xl border border-[#00D4AA] p-6 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#00D4AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1A1F36]">
            ~{formatCurrency(report.recoveryOpportunity)}/month is recoverable
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Smart retry logic recovers ~70% of failed payments automatically
          </p>
        </div>
      </div>

      {/* CTA */}
      <CTABanner recoveryOpportunity={report.recoveryOpportunity} />

      <p className="text-center text-xs text-gray-400">
        stripe-churn-calculator · open source · data processed in your browser, never uploaded ·{' '}
        <a href="/" className="hover:text-[#635BFF] transition-colors">run another calculation</a>
      </p>
    </div>
  )
}
