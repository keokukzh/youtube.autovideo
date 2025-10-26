# Next.js SaaS Template

A production-ready template for building SaaS applications with Next.js, TypeScript, Supabase, and Stripe.

## Features

- **Next.js 14** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Supabase** for database and authentication
- **Stripe** for payments
- **Jest** and **Playwright** for testing
- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks
- **GitHub Actions** for CI/CD
- **Dependabot** for dependency updates

## Quick Start

### 1. Initialize New Project

```bash
# Clone the template
git clone <template-repo-url> my-saas-app
cd my-saas-app

# Remove git history
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial commit from template"

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
# Add your Supabase, Stripe, and other API keys
```

### 3. Database Setup

```bash
# Create Supabase project
# Run migrations
supabase db push

# Generate types
supabase gen types typescript --local > lib/database.types.ts
```

### 4. Start Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   └── landing/          # Landing page components
├── lib/                  # Utility libraries
│   ├── supabase.ts      # Supabase client
│   ├── openai.ts        # OpenAI integration
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
├── __tests__/           # Unit tests
├── tests/               # E2E tests
├── .github/             # GitHub Actions workflows
├── docs/                # Documentation
└── supabase/            # Database migrations
```

## Customization

### 1. Update Branding

- Replace logo and favicon in `public/`
- Update colors in `tailwind.config.ts`
- Modify brand name in `package.json` and `README.md`

### 2. Configure Authentication

- Update Supabase project settings
- Modify auth providers in Supabase dashboard
- Customize auth pages in `app/auth/`

### 3. Set Up Payments

- Create Stripe products and prices
- Update price IDs in environment variables
- Customize pricing page in `app/pricing/`

### 4. Customize Database

- Modify migrations in `supabase/migrations/`
- Update types in `lib/database.types.ts`
- Adjust RLS policies as needed

### 5. Add Features

- Create new API routes in `app/api/`
- Add new pages in `app/`
- Create components in `components/`
- Add tests in `__tests__/` and `tests/`

## Environment Variables

### Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Optional

```env
# OpenAI (if using AI features)
OPENAI_API_KEY=sk-your_openai_api_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript compiler
npm run validate        # Run all quality checks

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms

- **Netlify**: Use `npm run build` and deploy `out/` directory
- **Railway**: Use `npm run build` and `npm run start`
- **Docker**: Use provided Dockerfile

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- Button.test.tsx

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- auth.spec.ts

# Run E2E tests with UI
npm run test:e2e:ui
```

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint -- --fix
```

### Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check
```

## CI/CD

### GitHub Actions

The template includes GitHub Actions workflows for:

- **CI**: Automated testing on PRs
- **Deploy**: Production deployment
- **Dependabot**: Automated dependency updates

### Pre-commit Hooks

Husky is configured to run:

- ESLint on staged files
- Prettier formatting
- TypeScript type checking
- Commit message validation

## Security

### Built-in Security Features

- Row Level Security (RLS) policies
- Input validation with Zod
- Rate limiting on API routes
- CSRF protection
- Security headers
- Dependency vulnerability scanning

### Security Best Practices

- Never commit secrets
- Use environment variables
- Validate all inputs
- Implement proper error handling
- Keep dependencies updated

## Performance

### Optimization Features

- Next.js Image optimization
- Code splitting
- Lazy loading
- Bundle analysis
- Performance monitoring

### Performance Best Practices

- Use Server Components when possible
- Implement proper caching
- Optimize images and assets
- Monitor Core Web Vitals

## Monitoring

### Built-in Monitoring

- Vercel Analytics
- Error tracking
- Performance monitoring
- Uptime monitoring

### Custom Metrics

Add your own monitoring:

- Custom analytics events
- Error tracking
- Performance metrics
- User behavior tracking

## Troubleshooting

### Common Issues

1. **Build Errors**: Check TypeScript errors and dependencies
2. **Database Issues**: Verify Supabase configuration and RLS policies
3. **Authentication Issues**: Check Supabase auth settings
4. **Payment Issues**: Verify Stripe configuration and webhooks

### Getting Help

- Check the documentation in `docs/`
- Search existing issues
- Create a new issue with detailed information
- Check the troubleshooting guide

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run quality checks
6. Submit a pull request

## License

This template is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Join the community discussions

---

**Happy coding! 🚀**
