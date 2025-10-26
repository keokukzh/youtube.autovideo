# 🧪 Local Testing Guide - ContentMultiplier.io

## 🚀 Quick Start (Port 3004)

Since ports 3000-3003 are in use, we'll run on **port 3004**.

### 1. **Set Up Environment Variables**

Create a `.env.local` file in your project root with these values:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration (LIVE - from your account)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Stripe Price IDs (created in your account)
STRIPE_PRICE_ID_STARTER=price_1SMLRy6bysxOOlngWzvfCgZf
STRIPE_PRICE_ID_PRO=price_1SMLS36bysxOOlngvQwVc26f
STRIPE_PRICE_ID_TEAM=price_1SMLS76bysxOOlngLFQTQUfb

# Worker Security
CRON_SECRET=test_cron_secret_12345

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3004
NODE_ENV=development
```

### 2. **Install Dependencies & Start**

```bash
# Install dependencies
npm install

# Start development server on port 3004
npm run dev -- -p 3004
```

### 3. **Test Complete Flow**

#### A. **Authentication Flow**

1. Go to `http://localhost:3004`
2. Click "Sign Up"
3. Create account with email/password
4. Verify you're redirected to dashboard

#### B. **Content Generation Flow**

1. Go to dashboard
2. Try **YouTube URL**:
   - Use: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Watch polling UI update
   - Verify completion in ~2 minutes

3. Try **Text Input**:
   - Paste any long text (500+ words)
   - Watch real-time progress
   - Verify all 10 outputs generated

4. Try **Audio Upload**:
   - Upload MP3/WAV file
   - Watch transcription progress
   - Verify content generation

#### C. **Payment Flow**

1. Go to `/dashboard/billing`
2. Click "Upgrade" on any plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription updated

#### D. **Worker Processing**

1. Check browser console for API calls
2. Monitor job status changes
3. Verify background processing works

---

## 🔧 Testing Commands

### **Start Development Server**

```bash
npm run dev -- -p 3004
```

### **Type Check**

```bash
npm run type-check
```

### **Lint Code**

```bash
npm run lint
```

### **Format Code**

```bash
npm run format
```

### **Run Tests**

```bash
npm test
```

---

## 🐛 Troubleshooting

### **Port Already in Use**

```bash
# Check what's using port 3004
netstat -an | findstr :3004

# Kill process if needed
taskkill /PID <process_id> /F
```

### **Environment Variables Missing**

- Ensure `.env.local` exists in project root
- Restart development server after adding variables
- Check console for missing variable errors

### **Supabase Connection Issues**

- Verify URL and keys are correct
- Check Supabase dashboard for API status
- Ensure RLS policies are enabled

### **Stripe Webhook Issues**

- Use Stripe CLI for local testing:

```bash
stripe listen --forward-to localhost:3004/api/stripe/webhook
```

### **Worker Not Processing**

- Check `CRON_SECRET` is set correctly
- Verify Supabase functions are created
- Check browser network tab for API calls

---

## 📊 Expected Results

### **Successful Test Results:**

- ✅ User can sign up and login
- ✅ Content generation completes in <2 minutes
- ✅ All 10 output formats generated
- ✅ Real-time progress updates work
- ✅ Payment flow redirects to Stripe
- ✅ Webhook updates subscription
- ✅ Credits are deducted correctly
- ✅ Rate limiting prevents abuse

### **Performance Benchmarks:**

- **Page Load**: <2 seconds
- **Content Generation**: 1-3 minutes
- **Payment Flow**: <30 seconds
- **API Response**: <500ms

---

## 🎯 Test Checklist

- [ ] Environment variables set
- [ ] Development server starts on port 3004
- [ ] Authentication works
- [ ] YouTube content generation
- [ ] Text content generation
- [ ] Audio file upload
- [ ] Payment checkout flow
- [ ] Webhook processing
- [ ] Credit deduction
- [ ] Rate limiting
- [ ] Error handling
- [ ] Progress tracking

---

## 🚀 Ready to Launch!

Once all tests pass, your ContentMultiplier.io is **production-ready**!

**Next Steps:**

1. Deploy to Vercel
2. Set up production environment variables
3. Configure Stripe webhook for production URL
4. Monitor usage and scale as needed

**Total cost: $0/month** until 1,000+ users! 🎉
