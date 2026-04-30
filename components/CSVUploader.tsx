'use client'

import { useState, useCallback } from 'react'

interface CSVUploaderProps {
  onFile: (file: File) => void
  loading: boolean
  error?: string
}

export default function CSVUploader({ onFile, loading, error }: CSVUploaderProps) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) onFile(file)
  }, [onFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="w-full">
      <label
        htmlFor="csv-upload"
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${dragging ? 'border-[#635BFF] bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-[#635BFF] hover:bg-indigo-50'}
          ${loading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">
            {loading ? 'Processing…' : <><span className="font-semibold text-[#635BFF]">Drop your Stripe charges CSV</span> or click to upload</>}
          </p>
          <p className="text-xs text-gray-400">Export from Stripe Dashboard → Payments → Export</p>
        </div>
        <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleChange} disabled={loading} />
      </label>
      {error && <p className="mt-2 text-sm text-[#FF4D4F]">{error}</p>}
    </div>
  )
}
