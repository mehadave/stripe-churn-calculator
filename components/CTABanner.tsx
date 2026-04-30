'use client'

import { formatCurrency } from '@/lib/calculations'

interface CTABannerProps {
  recoveryOpportunity: number
}

export default function CTABanner({ recoveryOpportunity }: CTABannerProps) {
  return (
    <div className="bg-[#0A2540] rounded-xl p-8 text-center">
      <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-widest mb-2">Recovery opportunity</p>
      <h3 className="text-white text-3xl font-bold mb-2">
        Recover ~{formatCurrency(recoveryOpportunity)}/month automatically
      </h3>
      <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
        Smart payment retry logic recovers ~70% of failed payments on average — without any manual intervention.
      </p>
      <a
        href="https://getreflow.co"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#635BFF] hover:bg-[#5248e0] text-white font-semibold transition-colors"
      >
        Recover it with Reflow
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      <p className="text-gray-600 text-xs mt-4">AI-powered billing recovery for Stripe · No code required</p>
    </div>
  )
}
