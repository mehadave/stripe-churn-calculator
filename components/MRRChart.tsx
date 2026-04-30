'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MRRDataPoint } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'

interface MRRChartProps {
  data: MRRDataPoint[]
}

export default function MRRChart({ data }: MRRChartProps) {
  if (!data || data.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">MRR Trend</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#635BFF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF4D4F" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF4D4F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            formatter={(value, name) => [formatCurrency(Number(value)), name === 'mrr' ? 'MRR' : 'Churned']}
            contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="mrr" stroke="#635BFF" strokeWidth={2} fill="url(#mrrGrad)" />
          <Area type="monotone" dataKey="churned" stroke="#FF4D4F" strokeWidth={2} fill="url(#churnGrad)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-[#635BFF] inline-block rounded" />MRR</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-[#FF4D4F] inline-block rounded" />Churned</span>
      </div>
    </div>
  )
}
