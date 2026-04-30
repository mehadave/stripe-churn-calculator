'use client'

interface MetricCardProps {
  label: string
  value: string
  subtitle?: string
  variant?: 'default' | 'danger' | 'success'
}

export default function MetricCard({ label, value, subtitle, variant = 'default' }: MetricCardProps) {
  const valueColor =
    variant === 'danger' ? 'text-[#FF4D4F]' :
    variant === 'success' ? 'text-[#00D4AA]' :
    'text-[#1A1F36]'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}
