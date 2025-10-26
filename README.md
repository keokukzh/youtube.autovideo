# ContentMultiplier.io - AI-Powered Content Repurposing

A complete SaaS application that transforms YouTube videos, podcasts, and blog posts into 10+ ready-to-publish content formats using AI.

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
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Enable Row Level Security (RLS) policies are included in the migration

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

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
