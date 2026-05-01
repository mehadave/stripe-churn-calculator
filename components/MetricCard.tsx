'use client'

import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string
  subtitle?: string
  variant?: 'default' | 'danger' | 'success'
  delay?: number
}

export default function MetricCard({ label, value, subtitle, variant = 'default', delay = 0 }: MetricCardProps) {
  const valueColor =
    variant === 'danger' ? 'text-[#FF4D4F]' :
    variant === 'success' ? 'text-[#00D4AA]' :
    'text-[#1A1F36]'

  const accentBg =
    variant === 'danger' ? 'bg-[#FF4D4F]/5 border-[#FF4D4F]/20' :
    variant === 'success' ? 'bg-[#00D4AA]/5 border-[#00D4AA]/20' :
    'bg-white border-gray-200'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`rounded-xl border p-5 shadow-sm ${accentBg}`}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  )
}
