'use client'

import { motion } from 'framer-motion'

export default function ReflowPage() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#635BFF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#FF4D4F]/10 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg"
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16 rounded-2xl bg-[#3730A3] shadow-2xl shadow-[#3730A3]/50 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24">
              <polyline points="2,7 8,13 14,7 22,15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#635BFF]/20 border border-[#635BFF]/30 text-[#a5a0ff] text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse" />
          Coming soon
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
          Reflow is still<br />
          <span className="text-[#635BFF]">being built.</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          AI-powered billing recovery for Stripe is on the way. If the free calculator was useful, a ⭐ on GitHub goes a long way — it&apos;s what keeps this going.
        </p>

        {/* CTA */}
        <motion.a
          href="https://github.com/mehadave/stripe-churn-calculator"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#1A1F36] font-bold text-base shadow-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Star on GitHub
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </motion.a>

        <p className="mt-5 text-gray-600 text-sm">
          or{' '}
          <a href="/" className="text-[#635BFF] hover:text-[#a5a0ff] transition-colors underline underline-offset-2">
            go back to the calculator
          </a>
        </p>
      </motion.div>
    </div>
  )
}
