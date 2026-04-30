'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChurnReport } from '@/lib/types'
import LeakReport from '@/components/LeakReport'

export default function ReportPage() {
  const router = useRouter()
  const [report, setReport] = useState<ChurnReport | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('churnReport')
    if (!raw) {
      router.replace('/')
      return
    }
    try {
      setReport(JSON.parse(raw))
    } catch {
      router.replace('/')
    }
  }, [router])

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <header className="bg-[#0A2540] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg tracking-tight hover:text-gray-300 transition-colors">
            stripe-churn-calculator
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← New calculation
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6">
        <LeakReport report={report} />
      </div>
    </div>
  )
}
