/**
 * Main Cloudflare Worker entry point
 * Handles routing for API endpoints and serves static assets
 */

import type { Env, RequestContext, ApiHandler } from './types';
import { handleCORS } from './utils/response';

// Cloudflare Workers runtime types
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// Import API handlers
import { handleGenerate } from './handlers/generate';
import { handleStripeWebhook } from './handlers/stripe-webhook';
import { handleStripeCheckout } from './handlers/stripe-checkout';
import { handleAuthLogout } from './handlers/auth-logout';
import { handleWorkerProcess } from './handlers/worker-process';
import { handleGenerationById } from './handlers/generation-id';
import { handleCronCleanup } from './handlers/cron-cleanup';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const context: RequestContext = { request, env, ctx };

    // Handle CORS preflight requests
    const corsResponse = handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route API requests
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(context);
    }

    // Serve static assets for all other requests
    return serveStaticAssets(request, env);
  },
};

async function handleApiRequest(context: RequestContext): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace('/api/', '');

  // Route to appropriate handler
  const routes: Record<string, ApiHandler> = {
    generate: handleGenerate,
    'stripe/webhook': handleStripeWebhook,
    'stripe/checkout': handleStripeCheckout,
    'auth/logout': handleAuthLogout,
    'worker/process': handleWorkerProcess,
    'cron/cleanup': handleCronCleanup,
  };

  // Handle dynamic routes
  if (pathname.startsWith('generation/')) {
    return handleGenerationById(context);
  }

  // Find matching route
  const handler = routes[pathname];
  if (!handler) {
    return new Response('API endpoint not found', {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    return await handler(context);
  } catch (error) {
    console.error('API handler error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

async function serveStaticAssets(
  request: Request,
  env: Env
): Promise<Response> {
  // Get the ASSETS binding from environment
  const assets = (env as any).ASSETS;

  if (!assets) {
    return new Response('Assets not configured', { status: 500 });
  }

  try {
    // Try to fetch the asset
    const response = await assets.fetch(request);

    // If asset not found, serve index.html for SPA routing
    if (response.status === 404) {
      const indexRequest = new Request(new URL('/index.html', request.url));
      const indexResponse = await assets.fetch(indexRequest);

      if (indexResponse.status === 200) {
        return new Response(indexResponse.body, {
          ...indexResponse,
          status: 200,
          headers: {
            ...Object.fromEntries(indexResponse.headers.entries()),
            'Content-Type': 'text/html',
          },
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Error serving static assets:', error);
    return new Response('Error serving assets', { status: 500 });
  }
}
