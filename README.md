# ContentMultiplier.io - AI-Powered Content Repurposing

A complete SaaS application that transforms YouTube videos, podcasts, and blog posts into 10+ ready-to-publish content formats using AI.

<!-- Badges -->
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

<!-- Placeholder for CI/CD badges when GitHub Actions are configured:
[![CI/CD](https://img.shields.io/github/workflow/status/org/repo/CI?style=flat-square)](link-to-actions)
[![Coverage](https://img.shields.io/codecov/c/github/org/repo?style=flat-square)](link-to-coverage)
-->

> **Quick Start**: New users can be up and running locally in under 10 minutes! See [Quick Start](#-quick-start) below.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Example Workflows](#-example-workflows)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Pricing Tiers](#-pricing-tiers)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Design System](#-design-system)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Development Commands](#-development-commands)
- [Future Enhancements](#-future-enhancements)

## 🚀 Features

### Core Functionality

- **Multi-Input Support**: YouTube URLs, audio file uploads, and direct text input
- **AI Content Generation**: Creates 10 different content formats from a single input
- **Credit System**: Usage-based pricing with monthly credit allocation
- **User Authentication**: Secure signup/login with Supabase Auth
- **Real-time Processing**: Live progress updates during content generation

### Generated Content Formats

1. **Twitter Posts** (5 variations) - 280 characters each with hashtags
2. **LinkedIn Posts** (3 variations) - Professional tone, up to 1,300 characters
3. **Instagram Captions** (2 variations) - Engaging tone, up to 2,200 characters
4. **Blog Article** - SEO-optimized, 1,500-2,500 words with H2 headings
5. **Email Newsletter** - Subject line + 500-word body
6. **Quote Graphics** (5 variations) - Text for Canva graphics
7. **Twitter Thread** - 8-12 connected tweets
8. **Podcast Show Notes** - Bullet points with timestamps
9. **Video Script Summary** - Key talking points
10. **TikTok/Reels Hooks** (5 variations) - Attention-grabbing hooks

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Next.js API routes, Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4 for content generation, Whisper for audio transcription
- **Transcription**: Free `youtube-transcript` package + OpenAI Whisper fallback
- **Styling**: Tailwind CSS with custom gradient design system
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate/             # Content generation endpoint
│   │   └── auth/logout/          # Authentication endpoints
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── generation/[id]/      # Generation results
│   │   └── page.tsx              # Main dashboard
│   ├── login/                    # Authentication pages
│   ├── signup/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   └── landing/                  # Landing page components
├── lib/                          # Utility libraries
│   ├── supabase.ts              # Supabase client & helpers
│   ├── openai.ts                # OpenAI integration
│   ├── transcription.ts         # Audio/video transcription
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Helper functions
├── supabase/                     # Database migrations
│   └── migrations/
└── public/                       # Static assets
```

### Architecture & Data Flow

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       ▼                                             ▼
┌──────────────┐                            ┌────────────────┐
│  Landing &   │                            │  Authentication│
│  Marketing   │                            │  (Supabase)    │
│    Pages     │                            └────────┬───────┘
└──────┬───────┘                                     │
       │                                             │
       ▼                                             ▼
┌──────────────────────────────────────────────────────────┐
│                    Dashboard                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Upload     │  │   History    │  │   Settings   │   │
│  │  Interface   │  │   Display    │  │   & Billing  │   │
│  └──────┬───────┘  └──────────────┘  └──────────────┘   │
└─────────┼──────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────┐
   │ API Route:   │
   │ /api/generate│
   └──────┬───────┘
          │
          ├─────────────────┬─────────────────┬──────────────┐
          ▼                 ▼                 ▼              ▼
   ┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐
   │ YouTube  │      │  Audio   │     │  OpenAI  │   │ Database │
   │Transcript│      │  Whisper │     │  GPT-4   │   │(Supabase)│
   └──────┬───┘      └──────┬───┘     └──────┬───┘   └──────┬───┘
          │                 │                │              │
          └─────────────────┴────────────────┘              │
                            │                               │
                            ▼                               │
                    ┌──────────────┐                        │
                    │  10 Content  │                        │
                    │   Formats    │◄───────────────────────┘
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  User Gets   │
                    │   Results    │
                    └──────────────┘
```

**Data Flow:**
1. **Input** → User uploads YouTube URL, audio file, or text
2. **Transcription** → Content is converted to text (YouTube Transcript or Whisper API)
3. **AI Generation** → OpenAI GPT-4 generates 10 different content formats
4. **Storage** → Results saved to Supabase database with user association
5. **Delivery** → User can view, copy, or download individual/bulk outputs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd contentmultiplier
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database migrations from the `supabase/migrations/` directory
3. Row Level Security (RLS) policies are included in the migrations

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 Documentation

For detailed guides and additional information:

- **[UI/UX Agent Setup](UI_UX_AGENT_SETUP.md)** - Custom agent configuration for UI/UX design work
- **[Debug Setup](debug-setup.md)** - Debugging tools, troubleshooting, and development workflow
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions for Vercel and production setup
- **[API Documentation](docs/api/README.md)** - Detailed API endpoints and usage

## 💡 Example Workflows

### Workflow 1: YouTube Video to Social Media Posts

```bash
# User Journey (< 5 minutes)
1. Sign up and login → Get 5 free credits
2. Navigate to dashboard
3. Paste YouTube URL: "https://youtube.com/watch?v=..."
4. Click "Generate Content"
5. Wait 2-3 minutes for AI processing
6. Get 10 content formats:
   - 5 Twitter posts
   - 3 LinkedIn posts
   - 2 Instagram captions
   - 1 Blog article
   - 1 Email newsletter
   - 5 Quote graphics
   - 1 Twitter thread
   - 1 Podcast show notes
   - 1 Video script summary
   - 5 TikTok/Reels hooks
7. Copy individual posts or download all as ZIP
```

### Workflow 2: Podcast Audio to Written Content

```bash
# User Journey
1. Login to dashboard
2. Upload MP3/WAV audio file (max 10MB)
3. Click "Generate Content"
4. AI transcribes audio with Whisper
5. GPT-4 creates content from transcript
6. Download blog article for website
7. Copy LinkedIn post for promotion
8. Use quote graphics for social media
```

### Workflow 3: Blog Post to Multi-Platform Content

```bash
# User Journey
1. Login to dashboard
2. Select "Text Input"
3. Paste blog post content (min 100 chars)
4. Click "Generate Content"
5. Receive 10 repurposed formats
6. Schedule Twitter thread
7. Post LinkedIn article variation
8. Create Instagram carousel from quotes
```

## 🎯 Usage

### For Users

1. **Sign Up**: Create an account to get 5 free credits
2. **Upload Content**: Choose from YouTube URL, audio file, or text input
3. **Generate**: Click "Generate Content" and wait 2-5 minutes
4. **Download**: Copy individual outputs or download all as ZIP

### For Developers

- **Authentication**: Protected routes with Supabase Auth
- **Credit System**: Atomic credit deduction with database transactions
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Type Safety**: Full TypeScript coverage with strict mode

## 🔧 API Endpoints

### POST /api/generate

Generates content from user input.

**Request Body (FormData):**

- `input_type`: "youtube" | "audio" | "text"
- `input_url`: YouTube URL (for youtube type)
- `input_text`: Text content (for text type)
- `file`: Audio file (for audio type)

**Response:**

```json
{
  "success": true,
  "data": { "generation_id": "uuid" },
  "message": "Content generated successfully"
}
```

## 💳 Pricing Tiers

- **FREE**: 5 credits/month, basic outputs
- **STARTER**: 50 credits/month, $39
- **PRO**: 200 credits/month, $99
- **TEAM**: 500 credits/month, $199

_Note: Stripe integration is UI mockup only in current implementation_

## 🗄 Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `subscription_tier` (Text: FREE/STARTER/PRO/TEAM)
- `stripe_customer_id` (Text, Nullable)
- `created_at`, `updated_at` (Timestamps)

### Credits Table

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `credits_remaining` (Integer, Default: 5)
- `credits_total` (Integer, Default: 5)
- `resets_at` (Timestamp, Default: +1 month)

### Generations Table

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `input_type` (Text: youtube/audio/text)
- `input_url` (Text, Nullable)
- `transcript` (Text)
- `outputs` (JSONB with all 10 formats)
- `status` (Text: pending/processing/completed/failed)
- `created_at`, `updated_at` (Timestamps)

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: Secure session management with Supabase
- **Input Validation**: Zod schemas for all user inputs
- **File Upload Security**: Type and size validation for audio files
- **API Rate Limiting**: Credit-based usage limits

## 🎨 Design System

- **Colors**: Purple/blue gradient theme (#6366f1 to #8b5cf6)
- **Typography**: Inter font family
- **Components**: shadcn/ui with consistent styling
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 🧪 Testing

### Automated Tests

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] User can sign up with valid email/password
- [ ] User receives confirmation email (in development, check console)
- [ ] User can sign in with correct credentials
- [ ] User is redirected to dashboard after login
- [ ] User can sign out successfully
- [ ] Protected routes redirect to login when not authenticated

#### Content Generation Flow
- [ ] YouTube URL input validates correctly
- [ ] Audio file upload accepts MP3/WAV/M4A files
- [ ] Text input requires minimum 100 characters
- [ ] Credit counter updates after generation
- [ ] Progress indicator shows during processing
- [ ] All 10 content formats are generated
- [ ] Individual copy/download buttons work
- [ ] Bulk download creates ZIP file
- [ ] Generation history saves correctly

#### UI/UX Testing
- [ ] Landing page loads and displays correctly
- [ ] Navigation works on all pages
- [ ] Mobile responsiveness on all screen sizes
- [ ] Error states display user-friendly messages
- [ ] Loading states show appropriate feedback
- [ ] Forms validate input correctly
- [ ] Pricing page displays all tiers
- [ ] Settings page allows profile updates

#### Error Handling
- [ ] Invalid YouTube URLs show error message
- [ ] Large audio files show size limit error
- [ ] Insufficient credits show upgrade prompt
- [ ] Network errors show retry options
- [ ] API failures show fallback UI

## 📝 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🔮 Future Enhancements

- [ ] Stripe payment integration
- [ ] Team collaboration features
- [ ] Custom brand voice settings
- [ ] Batch processing for multiple inputs
- [ ] API access for developers
- [ ] Advanced analytics dashboard
- [ ] Content scheduling integration
- [ ] Multi-language support

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**
