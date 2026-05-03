import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stripe Churn Calculator — See how much MRR you\'re leaking',
  description: 'Free tool to visualize how much MRR you\'re leaking through failed payments and churn. No account required. Processes in your browser.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  )
}
