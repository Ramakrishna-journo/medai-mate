import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedAI Mate | Professional Newsroom AI',
  description: 'AI powered workflow automation and dashboard for professional newsrooms.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
