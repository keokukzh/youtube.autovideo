'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { OutputDisplay } from '@/components/dashboard/OutputDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import type { Generation, ContentOutputs } from '@/lib/types';

export default function GenerationDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generationId = searchParams.get('id');

  useEffect(() => {
    async function fetchGeneration() {
      if (!generationId) {
        setError('Generation ID not provided');
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('id', generationId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          setError('Generation not found');
          return;
        }

        setGeneration(data as unknown as Generation);
      } catch (err) {
        setError('Failed to load generation');
      } finally {
        setLoading(false);
      }
    }

    fetchGeneration();
  }, [generationId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading generation...</p>
        </div>
      </div>
    );
  }

  if (error || !generation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Generation Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            {error || 'The generation you are looking for does not exist.'}
          </p>
          <Link href="/dashboard/history">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const outputs: ContentOutputs = generation.outputs || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link href="/dashboard/history">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Generation Details
              </h1>
              <p className="mt-2 text-gray-600">
                View and manage your generated content
              </p>
            </div>
          </div>
        </div>

        {/* Generation Info */}
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Input Type</p>
                <p className="font-medium capitalize">
                  {generation.input_type?.replace('_', ' ') || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {formatDate(generation.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {formatRelativeTime(generation.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {generation.transcript && (
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-3 text-lg font-medium text-gray-900">
                Original Input
              </h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">
                  {generation.transcript}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Outputs */}
        <OutputDisplay outputs={outputs} />
      </div>
    </div>
  );
}
