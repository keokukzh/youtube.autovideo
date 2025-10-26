/**
 * Cloudflare Workers middleware for API routes
 * This handles routing for all API endpoints
 *
 * TEMPORARILY DISABLED FOR BUILD - TypeScript compatibility issues
 */

// export async function onRequest(context: any) {
//   const { request } = context;
//   const url = new URL(request.url);

//   // Extract the API path
//   const pathname = url.pathname.replace('/api/', '');

//   // Route to appropriate handler
//   switch (pathname) {
//     case 'auth/logout':
//       return handleAuthLogout(request);
//     case 'generate':
//       return handleGenerate(request);
//     case 'stripe/checkout':
//       return handleStripeCheckout(request);
//     case 'stripe/webhook':
//       return handleStripeWebhook(request);
//     case 'worker/process':
//       return handleWorkerProcess(request);
//     default:
//       // Handle dynamic routes like generation/[id]
//       if (pathname.startsWith('generation/')) {
//         return handleGenerationById(request, pathname);
//       }
//       return new Response('Not Found', { status: 404 });
//   }
// }

// async function handleAuthLogout(request: Request) {
//   // Import and call the actual route handler
//   const { POST } = await import('../../app/api/auth/logout/route');
//   return POST(request);
// }

// async function handleGenerate(request: Request) {
//   const { POST } = await import('../../app/api/generate/route');
//   return POST(request);
// }

// async function handleStripeCheckout(request: Request) {
//   const { POST } = await import('../../app/api/stripe/checkout/route');
//   return POST(request);
// }

// async function handleStripeWebhook(request: Request) {
//   const { POST } = await import('../../app/api/stripe/webhook/route');
//   return POST(request);
// }

// async function handleWorkerProcess(request: Request) {
//   const { POST } = await import('../../app/api/worker/process/route');
//   return POST(request);
// }

// async function handleGenerationById(request: Request, pathname: string) {
//   const { GET } = await import('../../app/api/generation/[id]/route');
//   return GET(request, { params: { id: pathname.split('/')[1] } });
// }
