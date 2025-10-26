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
    console.error('ASSETS binding not found in environment');
    return new Response('Assets not configured', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
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
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      }
    }

    // Ensure proper headers for static assets
    const headers = new Headers(response.headers);

    // Set proper content type based on file extension
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.endsWith('.css')) {
      headers.set('Content-Type', 'text/css');
    } else if (pathname.endsWith('.js')) {
      headers.set('Content-Type', 'application/javascript');
    } else if (pathname.endsWith('.html')) {
      headers.set('Content-Type', 'text/html');
    } else if (pathname.endsWith('.json')) {
      headers.set('Content-Type', 'application/json');
    } else if (pathname.endsWith('.woff2')) {
      headers.set('Content-Type', 'font/woff2');
    } else if (pathname.endsWith('.woff')) {
      headers.set('Content-Type', 'font/woff');
    } else if (pathname.endsWith('.ttf')) {
      headers.set('Content-Type', 'font/ttf');
    }

    // Add CORS headers for all assets
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error) {
    console.error('Error serving static assets:', error);
    return new Response('Error serving assets', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
