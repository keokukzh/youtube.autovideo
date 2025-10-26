'use client';

import { HistoryDisplay } from '@/components/dashboard/HistoryDisplay';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserGenerations } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import type {
  Generation,
  PaginationOptions,
  InputType,
  GenerationStatus,
  ContentOutputs,
} from '@/lib/types';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    data?: Generation[];
    pagination?: PaginationOptions;
    error?: string;
  } | null>(null);

  useEffect(() => {
    async function loadHistoryData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10;

        const historyResult = await getUserGenerations(user.id, page, limit);
        if (historyResult.success && historyResult.data) {
          setResult({
            ...historyResult,
            data: historyResult.data.map((generation) => {
              const mapped: Generation = {
                id: generation.id,
                user_id: generation.user_id,
                input_type: generation.input_type as InputType,
                transcript: generation.transcript,
                outputs: generation.outputs as unknown as ContentOutputs,
                status: generation.status as GenerationStatus,
                created_at: generation.created_at,
                updated_at: generation.updated_at,
                ...(generation.input_url && {
                  input_url: generation.input_url,
                }),
              };
              return mapped;
            }),
          });
        } else {
          setResult({
            success: false,
            error: historyResult.error || 'Failed to load history',
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              has_next: false,
              has_prev: false,
            },
          });
        }
      } catch (error) {
        console.error('Error loading history data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  if (!user || !result) {
    return null; // Will redirect to login
  }

  const page = parseInt(searchParams.get('page') || '1');

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
          generations={result.data || []}
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

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
