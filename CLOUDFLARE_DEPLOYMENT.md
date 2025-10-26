# Cloudflare Pages Deployment Guide

## Overview

This guide will help you deploy your ContentMultiplier.io Next.js application to Cloudflare Pages with API routes handled by Cloudflare Workers.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- All environment variables ready

## Step 1: Configure Next.js for Static Export

The `next.config.js` has been updated with:

```javascript
{
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## Step 2: Cloudflare Pages Build Settings

### Framework Preset

- **Select**: `Next.js (Static HTML Export)`

### Build Command

```bash
npm run build
```

### Build Output Directory

```text
out
```

### Root Directory (Advanced)

```text
./
```

## Step 3: Environment Variables

**Important**: `NEXT_PUBLIC_*` variables are safe for Cloudflare Pages as they're exposed to client-side code. Backend-only secrets must be configured in `wrangler.toml` for Cloudflare Workers to keep them secure.

### Pages Environment Variables (Client-Safe)

Set these in Cloudflare Pages dashboard under Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
NODE_ENV=production
```

### Backend-Only Variables (in wrangler.toml/Workers)

These sensitive secrets must be configured in your `wrangler.toml` file or Cloudflare Workers dashboard:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 4: API Routes Setup

Since Cloudflare Pages doesn't support serverless functions by default, we've created:

1. **Cloudflare Workers Function**: `functions/api/_middleware.ts`
2. **Wrangler Configuration**: `wrangler.toml`

### Configure wrangler.toml

First, update your `wrangler.toml` file with the correct environment variables:

```toml
name = "contentmultiplier-api"
main = "functions/api/_middleware.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "contentmultiplier-api"

[env.staging]
name = "contentmultiplier-api-staging"

# Environment variables (set these in Cloudflare dashboard)
# SUPABASE_SERVICE_ROLE_KEY
# OPENAI_API_KEY
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
# STRIPE_PUBLISHABLE_KEY

# Bindings for external services
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"

# R2 bucket for file storage
[[r2_buckets]]
binding = "FILES"
bucket_name = "contentmultiplier-files"
preview_bucket_name = "contentmultiplier-files-preview"
```

### Deploy API Routes

```bash
# Install wrangler (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set environment variables in Cloudflare dashboard
# Go to Workers & Pages > contentmultiplier-api > Settings > Variables
# Add all the backend-only variables listed above

# Deploy API routes
wrangler deploy
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

# Preview with Cloudflare Pages locally
npm run dev:cf

# Or test API routes locally
wrangler dev
```

### Deploy to Cloudflare

**Important**: Deploy in this order:

1. **First, deploy API routes (Workers):**

   ```bash
   wrangler deploy
   ```

2. **Then, deploy the static site (Pages):**

   ```bash
   npm run deploy:cf
   ```

   Or use the build script that does both:

   ```bash
   npm run build:cf
   ```

## Step 7: Custom Domain (Optional)

1. Go to Cloudflare Pages > Custom Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Step 8: Stripe Webhook Configuration

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://contentmultiplier-api.your-subdomain.workers.dev/api/stripe/webhook`
   - Replace `your-subdomain` with your Cloudflare Workers subdomain
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret to your Workers environment variables in Cloudflare dashboard

## Step 9: Supabase Configuration

1. Go to Supabase Dashboard > Settings > API
2. Copy Project URL and anon key (use these for `NEXT_PUBLIC_*` variables)
3. Copy Service Role key (use this for `SUPABASE_SERVICE_ROLE_KEY`)
4. Enable Row Level Security (RLS) policies
5. Set up CORS for your domain:
   - Add your Pages domain: `https://your-app.pages.dev`
   - Add your custom domain if applicable
   - Add your Workers domain: `https://contentmultiplier-api.your-subdomain.workers.dev`

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that all environment variables are set in both Pages and Workers
   - Verify `next.config.js` has `output: 'export'` configured
   - Run `npm run build` locally to test

2. **API Routes Not Working**:
   - Ensure Workers function is deployed: `wrangler deploy`
   - Check Workers logs: `wrangler tail`
   - Verify environment variables are set in Workers dashboard
   - Test health endpoint: `curl https://contentmultiplier-api.your-subdomain.workers.dev/api/health`

3. **Images Not Loading**:
   - Verify `images.unoptimized: true` in next.config.js
   - Check that images are in the `public` folder
   - Ensure proper image paths in components

4. **CORS Errors**:
   - Update Supabase CORS settings with all your domains
   - Check that API endpoints are correctly configured
   - Verify Workers domain is added to allowed origins

5. **Environment Variable Issues**:
   - Pages variables: Set in Cloudflare Pages dashboard
   - Workers variables: Set in Cloudflare Workers dashboard
   - Never mix client-safe and server-only variables

### Debug Commands

```bash
# Check build locally
npm run build

# Test API routes locally
wrangler dev

# Check Workers deployment status
wrangler deployments list

# Check Pages deployment status
wrangler pages deployments list <project-name>
# Note: Replace <project-name> with your Pages project slug
# Alternative: View deployments via Cloudflare Dashboard → Pages → Deployments tab

# View Workers logs
wrangler tail

# Test specific API endpoint
curl https://contentmultiplier-api.your-subdomain.workers.dev/api/health
```

## Performance Optimization

1. **Enable Cloudflare CDN**: Automatic with Pages
2. **Use Cloudflare Images**: For dynamic image optimization
3. **Enable Brotli Compression**: Automatic
4. **Set Cache Headers**: Configure in `next.config.js`

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **CORS Configuration**: Restrict to your domain
3. **Rate Limiting**: Implement in Workers function
4. **Input Validation**: Validate all API inputs

## Monitoring

1. **Cloudflare Analytics**: Built-in with Pages
2. **Workers Analytics**: Monitor API performance
3. **Error Tracking**: Set up error reporting
4. **Uptime Monitoring**: Use Cloudflare's monitoring tools

## Cost Optimization

1. **Free Tier**: 100,000 requests/day for Workers
2. **Pages**: Unlimited static requests
3. **R2 Storage**: 10GB free per month
4. **Bandwidth**: 1TB free per month

## Quick Reference

### Key URLs After Deployment

- **Pages Site**: `https://your-app.pages.dev`
- **API Endpoints**: `https://contentmultiplier-api.your-subdomain.workers.dev/api/*`
- **Health Check**: `https://contentmultiplier-api.your-subdomain.workers.dev/api/health`

### Essential Commands

```bash
# Deploy everything
npm run build:cf && wrangler deploy

# Local development
npm run dev:cf

# Check logs
wrangler tail

# Test API
curl https://contentmultiplier-api.your-subdomain.workers.dev/api/health
```

### Environment Variables Checklist

- [ ] Pages: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NODE_ENV`
- [ ] Workers: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
