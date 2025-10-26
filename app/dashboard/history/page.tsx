import { HistoryDisplay } from '@/components/dashboard/HistoryDisplay';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/supabase-server';
import { getUserGenerations } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface HistoryPageProps {
  searchParams: {
    page?: string;
    status?: string;
    input_type?: string;
  };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const page = parseInt(searchParams.page || '1');
  const limit = 10;

  const result = await getUserGenerations(user.id, page, limit);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Error Loading History
            </h1>
            <p className="mt-2 text-gray-600">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Generation History</h1>
                <p className="text-sm text-gray-500">
                  View and manage your content generations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user.email}</span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HistoryDisplay
          generations={(result.data || []) as any}
          pagination={
            result.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              has_next: false,
              has_prev: false,
            }
          }
          currentPage={page}
        />
      </main>
    </div>
  );
}
