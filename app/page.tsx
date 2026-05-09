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

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    color: '#FF4D4F',
    bg: 'bg-[#FF4D4F]/10',
    border: 'border-[#FF4D4F]/20',
    title: 'Find your leaks',
    description: 'See exactly how much MRR you\'re losing each month — split between failed payments and voluntary cancellations.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: '#635BFF',
    bg: 'bg-[#635BFF]/10',
    border: 'border-[#635BFF]/20',
    title: 'Real churn metrics',
    description: 'True customer churn rate, LTV, and MRR trend — calculated from your actual Stripe data, not estimates.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: '#00D4AA',
    bg: 'bg-[#00D4AA]/10',
    border: 'border-[#00D4AA]/20',
    title: 'Quantify recovery',
    description: '~70% of failed payments are recoverable with smart retry logic. See the exact dollar amount you\'re leaving on the table.',
  },
]

const audiences = [
  { label: 'SaaS founders', desc: 'who want to know where revenue is going' },
  { label: 'Indie hackers', desc: 'tracking early churn signals' },
  { label: 'Finance leads', desc: 'benchmarking MRR health' },
]

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
      setError(err instanceof Error ? err.message : "Failed to parse CSV. Make sure it's a Stripe charges or subscriptions export.")
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

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0A2540]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-[7px] bg-[#3730A3] shadow-lg shadow-[#3730A3]/50">
              <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                <polyline points="2,7 8,13 14,7 22,15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-white font-bold text-sm tracking-tight">
                <span className="hidden sm:inline">Stripe Churn Calculator</span>
                <span className="sm:hidden">Stripe Churn</span>
              </span>
              <span className="text-[10px] font-semibold text-[#635BFF] bg-[#635BFF]/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider">free</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <button onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">Calculator</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">How it works</button>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/mehadave/stripe-churn-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all border border-white/10 hover:border-white/20"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="/reflow"
              className="flex items-center gap-1.5 text-white text-sm px-3 py-1.5 rounded-lg bg-[#635BFF] hover:bg-[#5248e0] transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              <span className="hidden sm:inline">Recover with Reflow</span>
              <span className="sm:hidden">Reflow</span>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-[#0A2540] via-[#0d2d4f] to-[#0f3460] px-6 pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#635BFF 1px, transparent 1px), linear-gradient(90deg, #635BFF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#635BFF]/15 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-[#FF4D4F]/10 rounded-full blur-2xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              How much MRR are<br />
              <span className="text-[#FF4D4F]">you leaking?</span>
            </h1>
            <p className="text-white font-semibold text-xl max-w-lg mx-auto mb-8 [text-shadow:0_2px_16px_rgba(10,37,64,0.9)]">
              Find out in 30 seconds — upload your Stripe export or enter numbers manually.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
              {audiences.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-2 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full"
                >
                  <span className="text-white font-semibold">{a.label}</span>
                  <span className="text-gray-400">{a.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dark → light transition strip */}
      <div className="h-16 bg-gradient-to-b from-[#0f3460] to-[#F6F9FC]" />

      {/* ── Tagline ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pt-10 pb-10 text-center scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#1A1F36] text-xl sm:text-2xl font-bold leading-snug tracking-tight flex flex-wrap justify-center gap-x-1.5 gap-y-0.5 mb-4">
            {[
              { t: 'A', h: false }, { t: 'free,', h: false }, { t: 'simple,', h: false },
              { t: 'no-nonsense', h: false }, { t: 'MRR', h: false }, { t: 'calculator', h: false },
              { t: 'built', h: false }, { t: 'for', h: false },
              { t: '$100–$10k', h: true }, { t: 'MRR', h: true },
              { t: 'SaaS', h: false }, { t: 'startups.', h: false },
            ].map(({ t, h }, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={h ? 'text-[#635BFF] font-black' : 'text-[#1A1F36]'}
              >
                {t}
              </motion.span>
            ))}
          </p>
          <div className="flex justify-center mt-4">
            <p className="text-gray-500 text-sm leading-relaxed">
              At this stage, every dollar of leaked MRR matters — but you shouldn&apos;t have to pay for tools just to understand what you&apos;re losing.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`} style={{ color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-[#1A1F36] font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Smooth gradient bridge between feature cards and calculator */}
      <div className="h-12 bg-gradient-to-b from-[#F6F9FC] via-[#f0f4f9] to-white" />

      {/* ── Calculator card ────────────────────────────────────────── */}
      <section id="calculator" className="max-w-3xl mx-auto px-6 pb-20 bg-white scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/60 overflow-hidden"
        >
          {/* Card header */}
          <div className="px-4 sm:px-8 pt-7 pb-0">
            <h2 className="text-[#1A1F36] font-black text-xl mb-1">Calculate your MRR leak</h2>
            <p className="text-gray-400 text-sm">Upload a Stripe export for the most accurate results, or enter your numbers manually.</p>
          </div>

          {/* Tabs */}
          <div className="flex p-3 gap-1 mx-4 sm:mx-8 mt-5 bg-[#F6F9FC] rounded-xl border border-gray-100">
            {(['csv', 'manual'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === t ? 'text-[#635BFF]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-100"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{t === 'csv' ? 'Upload Stripe CSV' : 'Enter manually'}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-8 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {tab === 'csv' ? (
                  <div className="space-y-4">
                    <CSVUploader onFile={handleCSV} loading={loading} error={error} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
                          <p className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider">Subscriptions CSV</p>
                          <span className="text-xs text-[#00D4AA]/70 ml-auto">Most accurate</span>
                        </div>
                        <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                          <li>Dashboard → <span className="font-semibold text-gray-600">Billing → Subscriptions</span></li>
                          <li>Click <span className="font-semibold text-gray-600">Export</span></li>
                          <li>Download and drop above ↑</li>
                        </ol>
                      </div>
                      <div className="bg-[#F6F9FC] border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Charges CSV</p>
                          <span className="text-xs text-gray-400 ml-auto">Estimated</span>
                        </div>
                        <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                          <li>Dashboard → <span className="font-semibold text-gray-600">Payments</span></li>
                          <li>Click <span className="font-semibold text-gray-600">Export</span></li>
                          <li>Download and drop above ↑</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ManualInputForm onSubmit={handleManual} loading={loading} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-4 sm:px-8 pb-6 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-4">
            <div className="w-4 h-4 rounded-full bg-[#00D4AA]/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-[#00D4AA]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            Processed entirely in your browser — data is never uploaded anywhere
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#0A2540] border-t border-white/5 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#3730A3]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="white" viewBox="0 0 24 24">
                <polyline points="2,7 8,13 14,7 22,15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-400 font-medium">Stripe Churn Calculator</span>
          </div>

          <p className="text-gray-600 text-xs text-center">
            Made with <span className="text-red-400">❤️</span>{' '}in California &nbsp;·&nbsp; Open source
          </p>

          <div className="flex items-center gap-4">
            <a
              href="mailto:davemeha60@gmail.com"
              className="text-gray-500 hover:text-[#a5a0ff] transition-colors text-xs"
            >
              Contact
            </a>
            <a
              href="https://github.com/mehadave/stripe-churn-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
