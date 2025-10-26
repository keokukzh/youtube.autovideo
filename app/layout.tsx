import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ContentMultiplier.io - AI-Powered Content Repurposing',
  description:
    'Transform YouTube videos, podcasts, and blog posts into 10+ ready-to-publish content formats with AI. Create 10x more content in 10% of the time.',
  keywords:
    'content creation, AI, YouTube, podcast, blog, social media, content repurposing',
  authors: [{ name: 'ContentMultiplier.io' }],
  openGraph: {
    title: 'ContentMultiplier.io - AI-Powered Content Repurposing',
    description:
      'Transform YouTube videos, podcasts, and blog posts into 10+ ready-to-publish content formats with AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentMultiplier.io - AI-Powered Content Repurposing',
    description:
      'Transform YouTube videos, podcasts, and blog posts into 10+ ready-to-publish content formats with AI.',
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
