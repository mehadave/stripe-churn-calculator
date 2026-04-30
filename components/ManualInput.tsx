'use client'

import { useState } from 'react'
import { ManualInput } from '@/lib/types'

interface ManualInputFormProps {
  onSubmit: (input: ManualInput) => void
  loading: boolean
}

const fields: { key: keyof ManualInput; label: string; placeholder: string; hint: string }[] = [
  { key: 'monthlyMRR', label: 'Monthly MRR ($)', placeholder: '25000', hint: 'Total monthly recurring revenue' },
  { key: 'totalCustomers', label: 'Active customers', placeholder: '200', hint: 'Number of paying subscribers' },
  { key: 'failedPaymentsPerMonth', label: 'Failed payments / month', placeholder: '8', hint: 'Avg number of failed charges per month' },
  { key: 'cancellationsPerMonth', label: 'Cancellations / month', placeholder: '5', hint: 'Avg voluntary cancellations per month' },
]

export default function ManualInputForm({ onSubmit, loading }: ManualInputFormProps) {
  const [values, setValues] = useState<Record<string, string>>({
    monthlyMRR: '',
    totalCustomers: '',
    failedPaymentsPerMonth: '',
    cancellationsPerMonth: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      monthlyMRR: parseFloat(values.monthlyMRR) || 0,
      totalCustomers: parseInt(values.totalCustomers) || 0,
      failedPaymentsPerMonth: parseFloat(values.failedPaymentsPerMonth) || 0,
      cancellationsPerMonth: parseFloat(values.cancellationsPerMonth) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-[#1A1F36] mb-1">{f.label}</label>
            <input
              type="number"
              min="0"
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1A1F36] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition"
              required
            />
            <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-[#635BFF] hover:bg-[#5248e0] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Calculating…' : 'Calculate my leak →'}
      </button>
    </form>
  )
}
