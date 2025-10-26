# Development Guide

This guide covers the local development workflow, debugging, and common development tasks for ContentMultiplier.io.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Development Workflow](#development-workflow)
- [Debugging Guide](#debugging-guide)
- [Database Management](#database-management)
- [Testing Workflow](#testing-workflow)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or yarn
- Git
- Supabase CLI (optional, for local development)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/contentmultiplier.git
   cd contentmultiplier
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in the required values in `.env.local`:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key

   # OpenAI
   OPENAI_API_KEY=sk-your_openai_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Enable Row Level Security policies

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Verify setup**
   ```bash
   npm run validate
   ```

### Development Server

The development server runs on `http://localhost:3000` with:

- Hot reloading for code changes
- TypeScript compilation
- ESLint integration
- Automatic browser refresh

## Development Workflow

### Daily Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Run tests in watch mode** (in another terminal)

   ```bash
   npm run test:watch
   ```

3. **Check code quality** (before committing)
   ```bash
   npm run validate
   ```

### Feature Development

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the style guide
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   npm run test:ci
   npm run test:e2e
   ```

4. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**
   - Fill out the PR template
   - Request review from team members
   - Address feedback and merge

### Code Quality Checks

Run these commands regularly during development:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# All checks
npm run validate
```

## Debugging Guide

### Frontend Debugging

#### React Developer Tools

- Install React Developer Tools browser extension
- Use the Components tab to inspect component state
- Use the Profiler tab to identify performance issues

#### Console Debugging

```typescript
// Use console.log for debugging (remove in production)
console.log('Debug info:', { user, data });

// Use console.error for errors
console.error('Error occurred:', error);
```

#### Error Boundaries

```typescript
// Wrap components in error boundaries for better error handling
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Backend Debugging

#### API Route Debugging

```typescript
// app/api/your-route/route.ts
export async function POST(request: Request) {
  try {
    console.log('Request received:', { url: request.url });

    const data = await request.json();
    console.log('Request data:', data);

    // Your logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Database Debugging

```typescript
// Enable Supabase debug logging
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      debug: process.env.NODE_ENV === 'development',
    },
  }
);
```

### Common Debugging Scenarios

#### Authentication Issues

1. Check if user is properly authenticated
2. Verify JWT token validity
3. Check Supabase auth configuration
4. Review middleware logic

#### Database Issues

1. Check RLS policies
2. Verify table permissions
3. Review query syntax
4. Check connection string

#### AI Generation Issues

1. Verify OpenAI API key
2. Check rate limits
3. Review prompt formatting
4. Check response parsing

## Database Management

### Local Development Database

#### Using Supabase CLI (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset

# Stop local Supabase
supabase stop
```

#### Using Remote Supabase

1. Create a development project in Supabase
2. Use separate database for development
3. Keep production data separate

### Database Operations

#### Running Migrations

```bash
# Apply new migrations
supabase db push

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > lib/database.types.ts
```

#### Seeding Data

```bash
# Run seed script
npm run db:seed
```

### Common Database Tasks

#### Adding a New Table

1. Create migration file in `supabase/migrations/`
2. Define table schema
3. Add RLS policies
4. Update TypeScript types
5. Test the migration

#### Modifying Existing Tables

1. Create new migration file
2. Use ALTER TABLE statements
3. Update RLS policies if needed
4. Test the migration

## Testing Workflow

### Running Tests

#### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific E2E test
npm run test:e2e -- --grep "login flow"
```

### Writing Tests

#### Unit Test Example

```typescript
// __tests__/lib/utils.test.ts
import { formatContent } from '@/lib/utils';

describe('formatContent', () => {
  it('should format content correctly', () => {
    const input = 'test content';
    const result = formatContent(input);

    expect(result).toBe('Test Content');
  });
});
```

#### Component Test Example

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

#### E2E Test Example

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL('/dashboard');
});
```

## Common Tasks

### Adding a New Feature

1. **Create feature branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Implement the feature**
   - Create components
   - Add API routes if needed
   - Update database schema if needed
   - Add tests

3. **Test the feature**

   ```bash
   npm run test:ci
   npm run test:e2e
   ```

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update API documentation

5. **Create pull request**

### Fixing a Bug

1. **Reproduce the bug**
   - Create a test case that reproduces the issue
   - Document the expected vs actual behavior

2. **Fix the bug**
   - Identify the root cause
   - Implement the fix
   - Add tests to prevent regression

3. **Test the fix**

   ```bash
   npm run test:ci
   npm run test:e2e
   ```

4. **Create pull request**

### Updating Dependencies

1. **Check for updates**

   ```bash
   npm outdated
   ```

2. **Update dependencies**

   ```bash
   npm update
   ```

3. **Test after updates**

   ```bash
   npm run validate
   ```

4. **Commit changes**
   ```bash
   git add package*.json
   git commit -m "chore: update dependencies"
   ```

### Database Schema Changes

1. **Create migration file**

   ```bash
   # Create new migration
   touch supabase/migrations/$(date +%Y%m%d%H%M%S)_description.sql
   ```

2. **Write migration SQL**

   ```sql
   -- Add new column
   ALTER TABLE users ADD COLUMN phone TEXT;

   -- Add RLS policy
   CREATE POLICY "Users can update own phone" ON users
     FOR UPDATE USING (auth.uid() = id);
   ```

3. **Test migration**

   ```bash
   supabase db reset
   ```

4. **Update TypeScript types**
   ```bash
   supabase gen types typescript --local > lib/database.types.ts
   ```

## Troubleshooting

### Common Issues

#### "Module not found" errors

- Check import paths
- Verify file extensions
- Check tsconfig.json paths configuration

#### TypeScript errors

- Run `npm run type-check` to see all errors
- Check for missing type definitions
- Verify interface definitions

#### Database connection errors

- Check environment variables
- Verify Supabase project settings
- Check network connectivity

#### Authentication issues

- Check JWT token validity
- Verify Supabase auth configuration
- Check middleware logic

#### Build errors

- Clear Next.js cache: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors

### Getting Help

1. **Check the logs**
   - Browser console for frontend issues
   - Terminal output for build issues
   - Supabase logs for database issues

2. **Search existing issues**
   - GitHub issues
   - Stack Overflow
   - Documentation

3. **Create a new issue**
   - Provide detailed error information
   - Include steps to reproduce
   - Add relevant code snippets

4. **Ask for help**
   - GitHub Discussions
   - Team chat
   - Code review comments

### Performance Issues

#### Frontend Performance

- Use React DevTools Profiler
- Check bundle size with `npm run build`
- Optimize images and assets
- Use lazy loading for components

#### Backend Performance

- Check database query performance
- Monitor API response times
- Use caching where appropriate
- Optimize AI API calls

---

For more specific issues or questions, please refer to the main documentation or create an issue in the repository.
