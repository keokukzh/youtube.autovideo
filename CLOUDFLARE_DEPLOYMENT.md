# Cloudflare Workers Deployment Guide

## Overview

This guide will help you deploy your ContentMultiplier.io Next.js application to Cloudflare Workers with static assets and API routes handled by a single Worker.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- All environment variables ready

## Step 1: Configure Next.js for Static Export

The `next.config.js` has been configured for static export:

```javascript
{
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  }
}
```

## Step 2: Wrangler Configuration

The `wrangler.toml` file has been configured for Workers with Assets:

```toml
name = "contentmultiplier"
main = "worker/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./out"
not_found_handling = "single-page-application"
run_worker_first = true
```

## Step 3: Environment Variables

### Local Development

Create a `.dev.vars` file in your project root for local development:

```bash
# Copy .dev.vars.example to .dev.vars and fill in your values
cp .dev.vars.example .dev.vars
```

### Production Environment Variables

Set these using Wrangler CLI or Cloudflare dashboard:

#### Public Variables (set in wrangler.toml)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.workers.dev
```

#### Secrets (set with wrangler secret put)

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put STRIPE_PUBLISHABLE_KEY
wrangler secret put STRIPE_PRICE_ID_STARTER
wrangler secret put STRIPE_PRICE_ID_PRO
wrangler secret put STRIPE_PRICE_ID_TEAM
wrangler secret put CRON_SECRET
```

## Step 4: Worker Structure

The application uses a single Cloudflare Worker that handles both static assets and API routes:

```
worker/
├── index.ts                    # Main Worker entry point
├── types.ts                    # Worker-specific types
├── handlers/                   # API route handlers
│   ├── generate.ts
│   ├── stripe-webhook.ts
│   ├── stripe-checkout.ts
│   ├── auth-logout.ts
│   ├── worker-process.ts
│   ├── generation-id.ts
│   └── cron-cleanup.ts
└── utils/                      # Utility functions
    ├── supabase.ts
    ├── openai.ts
    └── response.ts
```

### Deploy Worker

```bash
# Install wrangler (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set secrets (one-time setup)
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put OPENAI_API_KEY
# ... (set all secrets as shown above)

# Deploy Worker with static assets
npm run build && wrangler deploy
```

## Step 5: File Storage Setup

For file uploads, you'll need to set up Cloudflare R2:

1. Go to Cloudflare Dashboard > R2 Object Storage
2. Create a bucket named `contentmultiplier-files`
3. Create a preview bucket named `contentmultiplier-files-preview`
4. Note the bucket IDs and update the `wrangler.toml` file:
   - Replace `your-kv-namespace-id` with your actual KV namespace ID
   - Replace `your-preview-kv-namespace-id` with your preview KV namespace ID
5. The R2 bucket binding is already configured in the `wrangler.toml` template above

## Step 6: Deployment Commands

### Local Development

```bash
# Build the static site
npm run build

# Start local development server
npm run dev:worker
# or
wrangler dev
```

### Deploy to Cloudflare

**Single deployment command** (deploys both static assets and API routes):

```bash
# Deploy to production
npm run deploy:production

# Deploy to preview
npm run deploy:preview

# Or manually
npm run build && wrangler deploy
```

## Step 7: Custom Domain (Optional)

1. Go to Cloudflare Workers > Custom Domains
2. Add your domain (must be on Cloudflare DNS)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Step 8: Stripe Webhook Configuration

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://contentmultiplier.your-subdomain.workers.dev/api/stripe/webhook`
   - Replace `your-subdomain` with your Cloudflare Workers subdomain
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret and set it with: `wrangler secret put STRIPE_WEBHOOK_SECRET`

## Step 9: Supabase Configuration

1. Go to Supabase Dashboard > Settings > API
2. Copy Project URL and anon key (use these for `NEXT_PUBLIC_*` variables)
3. Copy Service Role key (use this for `SUPABASE_SERVICE_ROLE_KEY`)
4. Enable Row Level Security (RLS) policies
5. Set up CORS for your domain:
   - Add your Workers domain: `https://contentmultiplier.your-subdomain.workers.dev`
   - Add your custom domain if applicable

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that all environment variables are set in both Pages and Workers
   - Verify `next.config.js` has `output: 'export'` configured
   - Run `npm run build` locally to test

2. **API Routes Not Working**:
   - Ensure Worker is deployed: `wrangler deploy`
   - Check Worker logs: `wrangler tail`
   - Verify secrets are set: `wrangler secret list`
   - Test API endpoint: `curl https://contentmultiplier.your-subdomain.workers.dev/api/generate`

3. **Images Not Loading**:
   - Verify `images.unoptimized: true` in next.config.js
   - Check that images are in the `public` folder
   - Ensure proper image paths in components

4. **CORS Errors**:
   - Update Supabase CORS settings with all your domains
   - Check that API endpoints are correctly configured
   - Verify Workers domain is added to allowed origins

5. **Environment Variable Issues**:
   - Public variables: Set in `wrangler.toml` or Cloudflare dashboard
   - Secrets: Set with `wrangler secret put <KEY>`
   - Local development: Use `.dev.vars` file

### Debug Commands

```bash
# Check build locally
npm run build

# Test API routes locally
wrangler dev

# Check Worker deployment status
wrangler deployments list

# View Workers logs
wrangler tail

# Test specific API endpoint
curl https://contentmultiplier.your-subdomain.workers.dev/api/generate
```

## Performance Optimization

1. **Enable Cloudflare CDN**: Automatic with Workers
2. **Use Cloudflare Images**: For dynamic image optimization
3. **Enable Brotli Compression**: Automatic
4. **Set Cache Headers**: Configure in `next.config.js`

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **CORS Configuration**: Restrict to your domain
3. **Rate Limiting**: Implement in Workers function
4. **Input Validation**: Validate all API inputs

## Monitoring

1. **Cloudflare Analytics**: Built-in with Workers
2. **Workers Analytics**: Monitor API performance
3. **Error Tracking**: Set up error reporting
4. **Uptime Monitoring**: Use Cloudflare's monitoring tools

## Cost Optimization

1. **Free Tier**: 100,000 requests/day for Workers
2. **Static Assets**: Unlimited requests
3. **R2 Storage**: 10GB free per month
4. **Bandwidth**: 1TB free per month

## Quick Reference

### Key URLs After Deployment

- **Worker Site**: `https://contentmultiplier.your-subdomain.workers.dev`
- **API Endpoints**: `https://contentmultiplier.your-subdomain.workers.dev/api/*`
- **Custom Domain**: `https://your-domain.com` (if configured)

### Essential Commands

```bash
# Deploy everything
npm run build && wrangler deploy

# Local development
npm run dev:worker

# Check logs
wrangler tail

# Test API
curl https://contentmultiplier.your-subdomain.workers.dev/api/generate
```

### Environment Variables Checklist

- [ ] Public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`
- [ ] Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID_*`, `CRON_SECRET`

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers with Assets](https://developers.cloudflare.com/workers/runtime-apis/assets/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
