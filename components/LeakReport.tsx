'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChurnReport } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/calculations'
import MetricCard from './MetricCard'
import CTABanner from './CTABanner'

const MRRChart = dynamic(() => import('./MRRChart'), { ssr: false })

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * ease))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

interface LeakReportProps {
  report: ChurnReport
}

export default function LeakReport({ report }: LeakReportProps) {
  const [copied, setCopied] = useState(false)
  const animatedLeak = useCountUp(report.totalLeakedMRR)

  const handleShare = async () => {
    const text = `I just found out I'm leaking ${formatCurrency(report.totalLeakedMRR)}/month in MRR. Calculated with stripe-churn-calculator → https://stripe-churn-calculator.vercel.app`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-16">

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-200/80"
      >
        <div className="relative bg-[#0A2540] px-8 py-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#635BFF]/10 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF4D4F]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-2">You&apos;re leaking</p>
              <motion.p
                className="text-[#FF4D4F] font-black leading-none tracking-tight"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
              >
                {formatCurrency(animatedLeak)}
              </motion.p>
              <p className="text-gray-400 text-base mt-2">per month in MRR</p>
            </div>
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? 'Copied!' : 'Share'}
            </motion.button>
          </div>
        </div>

        <div className="px-8 py-3.5 bg-[#F6F9FC] border-t border-gray-100 flex items-center gap-1.5 text-sm text-gray-500">
          <span className="font-semibold text-[#1A1F36]">{report.totalCustomers} customers</span>
          <span className="text-gray-300">·</span>
          <span className="font-semibold text-[#1A1F36]">{report.monthsInDataset} month{report.monthsInDataset !== 1 ? 's' : ''}</span>
          <span className="text-gray-400">of data analysed</span>
        </div>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Failed payments" value={formatCurrency(report.involuntaryChurnMRR)} subtitle="per month · recoverable" variant="danger" delay={0.1} />
        <MetricCard label="Voluntary churn" value={formatCurrency(report.voluntaryChurnMRR)} subtitle="per month · cancellations" variant={report.voluntaryChurnMRR > 0 ? 'danger' : 'default'} delay={0.15} />
        <MetricCard label="Churn rate" value={formatPercent(report.churnRate)} subtitle="monthly" variant={report.churnRate > 0.05 ? 'danger' : 'default'} delay={0.2} />
        <MetricCard label="Avg LTV" value={report.avgLTV > 0 ? formatCurrency(report.avgLTV) : '—'} subtitle="at current churn" delay={0.25} />
      </div>

      {/* Chart */}
      {report.mrrTrend.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <MRRChart data={report.mrrTrend} />
        </motion.div>
      )}

      {/* Recovery callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="bg-gradient-to-r from-[#00D4AA]/10 to-[#635BFF]/5 rounded-xl border border-[#00D4AA]/25 p-5 flex items-center gap-4"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#00D4AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A1F36]">~{formatCurrency(report.recoveryOpportunity)}/month is recoverable</p>
          <p className="text-xs text-gray-500 mt-0.5">Smart retry logic recovers ~70% of failed payments automatically</p>
        </div>
      </motion.div>

      {/* CTA */}
      <CTABanner recoveryOpportunity={report.recoveryOpportunity} />

      <p className="text-center text-xs text-gray-400 pt-2">
        stripe-churn-calculator · open source · data processed in your browser ·{' '}
        <a href="/" className="hover:text-[#635BFF] transition-colors underline underline-offset-2">run another calculation</a>
      </p>
    </div>
  )
}
