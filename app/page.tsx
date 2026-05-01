'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CSVUploader from '@/components/CSVUploader'
import ManualInputForm from '@/components/ManualInput'
import { parseStripeCSV } from '@/lib/parseStripeCSV'
import { calculateFromManual } from '@/lib/calculations'
import { ManualInput } from '@/lib/types'

type Tab = 'csv' | 'manual'

export default function HomePage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('csv')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCSV = async (file: File) => {
    setLoading(true)
    setError('')
    try {
      const report = await parseStripeCSV(file)
      localStorage.setItem('churnReport', JSON.stringify(report))
      router.push('/report')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV. Make sure it's a Stripe charges export.")
      setLoading(false)
    }
  }

  const handleManual = (input: ManualInput) => {
    setLoading(true)
    const report = calculateFromManual(input)
    localStorage.setItem('churnReport', JSON.stringify(report))
    router.push('/report')
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      {/* Header */}
      <header className="bg-[#0A2540]/90 backdrop-blur-sm border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#635BFF] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">stripe-churn-calculator</span>
            <span className="text-xs text-[#635BFF] bg-[#635BFF]/15 px-2 py-0.5 rounded-full font-medium">free</span>
          </div>
          <a
            href="https://github.com/mehadave/stripe-churn-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#0A2540] via-[#0d2d4f] to-[#F6F9FC] px-6 pt-16 pb-24 overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#635BFF 1px, transparent 1px), linear-gradient(90deg, #635BFF 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Purple glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#635BFF]/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#635BFF]/20 border border-[#635BFF]/30 text-[#a5a0ff] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse" />
              Free · No account · Open source
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
              How much MRR are<br />
              <span className="text-[#FF4D4F]">you leaking?</span>
            </h1>
            <p className="text-white font-semibold text-lg max-w-md mx-auto [text-shadow:0_2px_12px_rgba(10,37,64,0.8)]">
              Find out in 30 seconds. Data never leaves your browser.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-3xl mx-auto px-6 -mt-14 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/60 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex p-2 gap-1 bg-[#F6F9FC] border-b border-gray-100">
            {(['csv', 'manual'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  tab === t ? 'text-[#635BFF]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">
                  {t === 'csv' ? 'Upload Stripe CSV' : 'Enter manually'}
                </span>
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'csv' ? (
                  <div className="space-y-4">
                    <CSVUploader onFile={handleCSV} loading={loading} error={error} />
                    <div className="bg-[#F6F9FC] rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">How to export from Stripe</p>
                      <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
                        <li>Go to <span className="font-semibold text-gray-600">Stripe Dashboard → Payments</span></li>
                        <li>Click <span className="font-semibold text-gray-600">Export</span> in the top right</li>
                        <li>Select date range and download CSV</li>
                        <li>Drop it above ↑</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <ManualInputForm onSubmit={handleManual} loading={loading} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-8 pb-5 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-4">
            <div className="w-4 h-4 rounded-full bg-[#00D4AA]/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-[#00D4AA]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            Processed entirely in your browser — data is never uploaded anywhere
          </div>
        </motion.div>
      </div>
    </div>
  )
}
