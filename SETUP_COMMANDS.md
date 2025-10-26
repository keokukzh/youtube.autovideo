# ContentMultiplier.io - Setup Commands

## 1. Initial Project Setup

```bash
# Create Next.js project
npx create-next-app@latest contentmultiplier --typescript --tailwind --app --use-npm

cd contentmultiplier

# Install core dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install stripe
npm install openai
npm install framer-motion
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install zod
npm install react-hook-form @hookform/resolvers

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-next
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install -D @playwright/test

# Initialize shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
```

## 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your actual values
# - Supabase project URL and keys
# - OpenAI API key
# - AssemblyAI API key
# - Stripe keys
# - App URL
```

## 3. Git Setup

```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Next.js setup with dependencies"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/yourusername/contentmultiplier.git
git branch -M main
git push -u origin main
```

## 4. Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## 5. Database Setup (Supabase)

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'STARTER', 'PRO', 'TEAM')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits table
CREATE TABLE credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 5,
  resets_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generations table
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_url TEXT,
  input_type TEXT CHECK (input_type IN ('youtube', 'audio', 'text')),
  transcript TEXT,
  outputs JSONB,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON credits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own generations" ON generations FOR UPDATE USING (auth.uid() = user_id);
```

## 6. Deployment (Vercel)

1. Push code to GitHub
2. Go to vercel.com
3. Import your GitHub repository
4. Add environment variables from `.env.local`
5. Deploy

## 7. Testing Setup

```bash
# Create test directories
mkdir -p tests/{unit,integration,e2e}

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## 8. Cursor AI Usage

### Essential Shortcuts:
- `CMD/CTRL + K` - AI Chat (for questions and code generation)
- `CMD/CTRL + I` - Composer (for multi-file editing)
- `CMD/CTRL + L` - Toggle Chat Sidebar
- `Tab` - Auto-complete code
- `Option + CMD + L` - Accept AI suggestion

### AI Features:
- Select code → `CMD+K` → "fix this" - AI fixes bugs
- `CMD+I` → "add error handling" - AI adds error handling
- `CMD+K` → Type question - AI answers code questions

## 9. Daily Workflow

### Morning:
```bash
git pull
cursor .
npm run dev
```

### During Development:
- Use `CMD+K` for quick questions
- Use `CMD+I` for multi-file changes
- Commit frequently (every feature)

### Before Pushing:
```bash
npm run type-check
npm run format
git add .
git commit -m "feat: descriptive commit message"
git push
```

## 10. Troubleshooting

### Cursor runs slowly:
- Disable AI Autocomplete for large files
- Restart Cursor
- Clear cache: `CMD+Shift+P` → "Clear Cache"

### Build errors:
- Check `.cursorrules` followed?
- Fix TypeScript errors immediately
- Dependency conflicts → Delete `node_modules`, reinstall

### AI gives wrong answers:
- Be more specific in prompts
- Provide context (e.g., "Using Next.js App Router")
- Show example code
