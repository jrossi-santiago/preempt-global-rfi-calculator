import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RFI Cost Calculator — Preempt Global',
  description: 'See your estimated change order exposure before bid day. Free tool built from real pre-construction findings on data center and large commercial projects.',
  keywords: [
    'rfi cost calculator',
    'change order exposure calculator',
    'construction document review tool',
    'data center construction risk calculator',
    'pre-bid document review',
    'construction readiness score',
  ],
  openGraph: {
    title: 'RFI Cost Calculator — Preempt Global',
    description: 'See your estimated change order exposure before bid day.',
    url: 'https://rficostcalculator.com',
    siteName: 'Preempt Global',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RFI Cost Calculator — Preempt Global',
    description: 'See your estimated change order exposure before bid day.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
