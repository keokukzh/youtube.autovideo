import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AriaLiveProvider } from '@/components/ui/aria-live-region';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Inter, sans-serif; }
            .text-gradient {
              background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
              -webkit-background-clip: text !important;
              background-clip: text !important;
              -webkit-text-fill-color: transparent !important;
              background-size: 200% 200% !important;
              animation: gradient 3s ease infinite !important;
            }
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              background-size: 200% 200% !important;
              animation: gradient 3s ease infinite !important;
            }
            .bg-gradient-to-r { background: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
            .from-indigo-600 { --tw-gradient-from: #4f46e5 !important; }
            .to-purple-600 { --tw-gradient-to: #9333ea !important; }
            .bg-clip-text { -webkit-background-clip: text !important; background-clip: text !important; }
            .text-transparent { color: transparent !important; }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Skip links for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:left-32 focus:top-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to navigation
        </a>

        <ErrorBoundary>
          <AriaLiveProvider>{children}</AriaLiveProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
