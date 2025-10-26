import { CreditCounter } from '@/components/dashboard/CreditCounter';
import { PageLoadingSpinner } from '@/components/LoadingSpinner';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { getCurrentUser } from '@/lib/supabase-server';
import { getUserCredits } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Suspense, lazy } from 'react';

// Lazy load the UploadInterface component for better performance
const UploadInterface = lazy(() =>
  import('@/components/dashboard/UploadInterface').then((module) => ({
    default: module.UploadInterface,
  }))
);

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const credits = await getUserCredits(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white" role="banner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-gradient text-2xl font-bold">
                ContentMultiplier.io
              </h1>
            </div>
            <nav
              className="flex items-center space-x-2 sm:space-x-4"
              aria-label="User navigation"
            >
              <div className="hidden sm:block">
                <CreditCounter credits={credits} />
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className="hidden text-sm text-gray-600 sm:inline"
                  aria-label={`Logged in as ${user.email}`}
                >
                  {user.email}
                </span>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="rounded px-2 py-1 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="main">
        {/* Mobile Credit Counter */}
        <div className="mb-6 sm:hidden">
          <CreditCounter credits={credits} />
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            Transform your YouTube videos, audio files, or text into 10+
            ready-to-publish content formats.
          </p>
        </div>

        <Suspense fallback={<PageLoadingSpinner />}>
          <UploadInterface />
        </Suspense>
      </main>

      {/* Performance Monitor - Development Only */}
      <PerformanceMonitor />
    </div>
  );
}
