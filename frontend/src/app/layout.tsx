import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LLM Parameter Lab',
  description: 'Experimental Console for AI Analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}