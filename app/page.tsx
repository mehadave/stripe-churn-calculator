'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      setError(err instanceof Error ? err.message : 'Failed to parse CSV. Make sure it\'s a Stripe charges export.')
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
      <header className="bg-[#0A2540] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg tracking-tight">stripe-churn-calculator</span>
            <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full">free · open source</span>
          </div>
          <a
            href="https://github.com"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#0A2540] px-6 pt-12 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            How much MRR are<br />you leaking?
          </h1>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Find out in 30 seconds. Free, no account required, data never leaves your browser.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 pb-16">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(['csv', 'manual'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'text-[#635BFF] border-b-2 border-[#635BFF]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'csv' ? '📂  Upload Stripe CSV' : '✏️  Enter manually'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'csv' ? (
              <div className="space-y-4">
                <CSVUploader onFile={handleCSV} loading={loading} error={error} />
                <div className="bg-[#F6F9FC] rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">How to export from Stripe</p>
                  <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                    <li>Go to <span className="font-medium">Stripe Dashboard → Payments</span></li>
                    <li>Click <span className="font-medium">Export</span> in the top right</li>
                    <li>Select date range and download CSV</li>
                    <li>Drop it above ↑</li>
                  </ol>
                </div>
              </div>
            ) : (
              <ManualInputForm onSubmit={handleManual} loading={loading} />
            )}
          </div>

          <div className="px-8 pb-6 flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 text-[#00D4AA] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your data is processed entirely in your browser and never uploaded anywhere
          </div>
        </div>
      </div>
    </div>
  )
}
