# Deployment Guide - ContentMultiplier.io

This guide covers deploying the ContentMultiplier.io application to production.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites

- GitHub repository with your code
- Vercel account
- Supabase project
- OpenAI API key

### Step 1: Prepare Your Repository

1. Ensure all code is committed and pushed to GitHub
2. Verify your `env.example` file is up to date
3. Test the application locally with `npm run build`

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🗄 Database Setup (Supabase)

### Production Database

1. Create a new Supabase project for production
2. Run the migration from `supabase/migrations/001_initial_schema.sql`
3. Verify RLS policies are enabled
4. Test database connection

### Environment Variables

Update your Supabase project settings:
- Copy the project URL and anon key
- Generate a service role key (keep this secret!)

## 🔧 Post-Deployment Configuration

### 1. Domain Setup (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### 2. Supabase Configuration

1. Update Supabase Auth settings:
   - Add your production URL to "Site URL"
   - Add your domain to "Redirect URLs"
   - Configure email templates if needed

### 3. OpenAI Configuration

1. Ensure your OpenAI API key has sufficient credits
2. Monitor usage in OpenAI dashboard
3. Set up billing alerts if needed

## 🔍 Health Checks

After deployment, verify:

### Basic Functionality
- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads for authenticated users
- [ ] Content generation works (test with a small input)

### Performance
- [ ] Page load times are acceptable
- [ ] API responses are fast
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

### Security
- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed
- [ ] Authentication redirects work correctly
- [ ] Protected routes are secured

## 📊 Monitoring Setup

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor page views and performance
3. Set up alerts for errors

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

### Database Monitoring

Monitor Supabase:
- Database performance
- API usage
- Storage usage
- Auth usage

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys on:
- Push to main branch
- Pull request previews

### Manual Deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from local
vercel --prod
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check environment variables are set
- Verify all dependencies are in package.json
- Check for TypeScript errors

#### Runtime Errors
- Check browser console for errors
- Verify API endpoints are working
- Check Supabase connection

#### Authentication Issues
- Verify Supabase URL and keys
- Check redirect URLs in Supabase
- Ensure HTTPS is enabled

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Scaling Considerations

### Performance Optimization

- Enable Vercel Edge Functions for API routes
- Use Supabase connection pooling
- Implement caching strategies
- Optimize images and assets

### Cost Management

- Monitor OpenAI API usage
- Set up Supabase usage alerts
- Optimize database queries
- Use Vercel Pro for better performance

## 🔐 Security Checklist

- [ ] All environment variables are secure
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection protection (Supabase handles this)
- [ ] XSS protection (React handles this)

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check browser console errors
4. Contact development team

---

**Deployment completed successfully! 🎉**

Your ContentMultiplier.io application is now live and ready for users.
