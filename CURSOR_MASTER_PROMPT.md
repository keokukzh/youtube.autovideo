# ContentMultiplier.io - Master Prompt for Cursor Composer

Use this prompt in Cursor Composer (CMD+I) to build the entire application:

```
I need you to build ContentMultiplier.io following these exact specifications.

CONTEXT:
I have a Next.js 14 project initialized with TypeScript, Tailwind CSS, and shadcn/ui components already installed. Follow the rules in .cursorrules strictly.

BUILD ORDER:
Build the application in this specific order, file by file:

PHASE 1: Foundation (Do this first)
1. Set up project structure (/app, /components, /lib folders)
2. Create /lib/supabase.ts with Supabase client
3. Create /lib/openai.ts with OpenAI client setup
4. Create /lib/stripe.ts with Stripe config
5. Create /lib/utils.ts with helper functions
6. Set up Supabase database schema (provide SQL migration)

PHASE 2: Landing Page
7. /app/page.tsx - Main landing page with all sections:
   - Hero (headline, CTAs, demo mockup)
   - How It Works (3 steps)
   - Features grid (9 features)
   - Pricing (4 tiers with toggle)
   - Testimonials (6 cards)
   - FAQ (accordion)
   - Final CTA
8. /components/landing/Hero.tsx
9. /components/landing/Features.tsx
10. /components/landing/Pricing.tsx
11. /components/landing/Testimonials.tsx
12. /components/landing/FAQ.tsx
13. /components/landing/CTA.tsx

PHASE 3: Authentication
14. /app/login/page.tsx - Login page
15. /app/signup/page.tsx - Signup page
16. /lib/auth.ts - Auth helper functions
17. Middleware for protected routes

PHASE 4: Dashboard Core
18. /app/dashboard/page.tsx - Main upload interface
19. /components/dashboard/UploadInterface.tsx - Input tabs (YouTube/Audio/Text)
20. /components/dashboard/ProcessingStatus.tsx - Progress indicator
21. /components/dashboard/OutputDisplay.tsx - Results grid
22. /components/dashboard/CreditCounter.tsx - Credits remaining display

PHASE 5: AI Processing
23. /app/api/generate/route.ts - Main generation endpoint
24. /app/api/transcribe/route.ts - Transcription endpoint
25. /lib/content-generator.ts - OpenAI prompt templates
26. /lib/format-outputs.ts - Output formatting logic

PHASE 6: Additional Pages
27. /app/dashboard/history/page.tsx - Past generations
28. /app/dashboard/settings/page.tsx - User settings
29. /app/dashboard/billing/page.tsx - Subscription management
30. /app/pricing/page.tsx - Public pricing page

PHASE 7: Payments
31. /app/api/stripe/checkout/route.ts - Create checkout session
32. /app/api/stripe/webhook/route.ts - Handle Stripe webhooks
33. /app/api/stripe/portal/route.ts - Customer portal

PHASE 8: Polish
34. Add loading states to all async operations
35. Add error boundaries
36. Add toast notifications
37. Implement animations with Framer Motion
38. Mobile responsive testing
39. SEO meta tags

For each file, generate:
1. Complete, production-ready code
2. TypeScript types/interfaces
3. Error handling
4. Loading states
5. Comments for complex logic

Start with PHASE 1, file 1. After I confirm it works, continue to the next file.

Ask me to confirm after each major component before continuing.

Ready to start with /lib/supabase.ts?
```

## Usage Instructions:

1. **Open Cursor Composer**: Press `CMD+I` (Mac) or `CTRL+I` (Windows/Linux)
2. **Paste the prompt**: Copy the entire prompt above and paste it into the composer
3. **Follow the phases**: The AI will build the application step by step
4. **Confirm each step**: Review and test each component before moving to the next
5. **Iterate as needed**: Ask for modifications or improvements at each step

## Key Features of This Prompt:

- **Structured approach**: Builds the app in logical phases
- **Follows .cursorrules**: Ensures consistent code quality
- **Production-ready**: Includes error handling, loading states, and proper TypeScript
- **Complete coverage**: All 10 output formats and full SaaS functionality
- **Mobile-first**: Responsive design with Tailwind CSS
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized with Next.js best practices

## Expected Output:

The AI will generate a complete SaaS application with:
- Beautiful landing page with all sections
- User authentication with Supabase
- Dashboard with upload interface
- AI content generation for all 10 formats
- Stripe payment integration
- User management and billing
- Mobile-responsive design
- Error handling and loading states
- SEO optimization

## Next Steps:

1. Run the setup commands from `SETUP_COMMANDS.md`
2. Configure your environment variables
3. Use this master prompt in Cursor Composer
4. Follow the build phases step by step
5. Test and deploy to Vercel

This setup will give you a production-ready ContentMultiplier.io application built with modern best practices and optimized for Cursor AI development.
