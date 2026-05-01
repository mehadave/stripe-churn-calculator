'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/calculations'

interface CTABannerProps {
  recoveryOpportunity: number
}

export default function CTABanner({ recoveryOpportunity }: CTABannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A2540]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#635BFF]/30 via-transparent to-[#00D4AA]/10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00D4AA]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative px-8 py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          Recovery opportunity
        </div>
        <h3 className="text-white text-3xl font-black mb-2 tracking-tight">
          Recover ~{formatCurrency(recoveryOpportunity)}/month
        </h3>
        <p className="text-gray-400 text-sm mb-7 max-w-sm mx-auto">
          Smart payment retry logic recovers ~70% of failed payments automatically — without any manual work.
        </p>
        <motion.a
          href="/reflow"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#635BFF] text-white font-semibold text-sm shadow-lg shadow-[#635BFF]/30 hover:bg-[#5248e0] transition-colors"
        >
          Recover it with Reflow
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>
        <p className="text-gray-600 text-xs mt-4">AI-powered billing recovery for Stripe · No code required</p>
      </div>
    </motion.div>
  )
}
