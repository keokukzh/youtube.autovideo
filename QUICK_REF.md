# ContentMultiplier.io - Quick Reference

## Tech Stack
- Next.js 14 + TypeScript + Tailwind
- Supabase (DB + Auth)
- OpenAI GPT-4
- Stripe
- Vercel (Hosting)

## Key Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Type-check: `npm run type-check`
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`
- E2E Test: `npm run test:e2e`

## Environment Variables
Copy `env.example` to `.env.local` and fill in your values:
- Supabase URL & Keys
- OpenAI API Key
- AssemblyAI API Key
- Stripe Keys
- App URL

## Database Tables
- users (id, email, subscription_tier, stripe_customer_id)
- credits (user_id, credits_remaining, resets_at)
- generations (user_id, input_url, outputs, status)

## API Routes
- POST /api/generate - Main AI generation
- POST /api/transcribe - Audio transcription
- POST /api/stripe/checkout - Create payment
- POST /api/stripe/webhook - Stripe events

## Pricing Tiers
- FREE: 5 credits/month, $0
- STARTER: 50 credits/month, $39
- PRO: 200 credits/month, $99
- TEAM: 500 credits/month, $199

## Output Formats (10 Total)
1. Twitter Posts (5x)
2. LinkedIn Posts (3x)
3. Instagram Captions (2x)
4. Blog Article (1x)
5. Email Newsletter (1x)
6. Quote Graphics (5x text)
7. Twitter Thread (1x)
8. Podcast Show Notes (1x)
9. Video Script Summary (1x)
10. TikTok/Reels Hooks (5x)

## Cursor AI Shortcuts
- CMD/CTRL + K - AI Chat
- CMD/CTRL + I - Composer (Multi-file editing)
- CMD/CTRL + L - Toggle Chat Sidebar
- Tab - Auto-complete code
- Option + CMD + L - Accept AI suggestion

## Development Workflow
1. Morning: `git pull` → `cursor .` → `npm run dev`
2. During dev: Use CMD+K for questions, CMD+I for changes
3. Before push: Test → Type-check → Format → Commit
4. Deploy: Push to GitHub → Vercel auto-deploys

## Support
- Cursor Docs: cursor.sh/docs
- Next.js Docs: nextjs.org/docs
- Supabase Docs: supabase.com/docs
- OpenAI Docs: platform.openai.com/docs
