import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { OutputDisplay } from '@/components/dashboard/OutputDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import type { Generation, ContentOutputs } from '@/lib/types';

interface GenerationPageProps {
  params: {
    id: string;
  };
}

export default async function GenerationPage({ params }: GenerationPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch generation data
  const { data: generation, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !generation) {
    notFound();
  }

  const generationData = {
    ...generation,
    outputs: generation.outputs as unknown as ContentOutputs,
  } as Generation;

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
                <h1 className="text-xl font-semibold">Generation Results</h1>
                <p className="text-sm text-gray-500">
                  {formatRelativeTime(generationData.created_at)}
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
        {/* Generation Info */}
        <div className="mb-8">
          <div className="rounded-lg border bg-white p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Input Type
                  </p>
                  <p className="text-sm capitalize text-gray-500">
                    {generationData.input_type}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(generationData.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <p className="text-sm capitalize text-gray-500">
                    {generationData.status}
                  </p>
                </div>
              </div>
            </div>

            {generationData.input_url && (
              <div className="mt-4 border-t pt-4">
                <p className="mb-1 text-sm font-medium text-gray-900">
                  Source URL
                </p>
                <a
                  href={generationData.input_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-blue-600 hover:text-blue-800"
                >
                  {generationData.input_url}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Output Display */}
        {generationData.status === 'completed' && generationData.outputs ? (
          <OutputDisplay outputs={generationData.outputs} />
        ) : generationData.status === 'processing' ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Processing Content
            </h3>
            <p className="text-gray-500">
              Your content is being generated. This may take a few minutes.
            </p>
          </div>
        ) : generationData.status === 'failed' ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Generation Failed
            </h3>
            <p className="mb-4 text-gray-500">
              There was an error processing your content.
            </p>
            <Link href="/dashboard">
              <Button>Try Again</Button>
            </Link>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-gray-300"></div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">Pending</h3>
            <p className="text-gray-500">
              Your generation is queued for processing.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
