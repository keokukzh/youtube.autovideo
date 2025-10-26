# Database Schema Documentation

This document describes the database schema, relationships, and constraints for ContentMultiplier.io.

## Table of Contents

- [Overview](#overview)
- [Tables](#tables)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Row Level Security](#row-level-security)
- [Triggers and Functions](#triggers-and-functions)
- [Migrations](#migrations)

## Overview

The database uses PostgreSQL with Supabase and implements a user-centric design with the following key concepts:

- **Users**: Authentication and subscription management
- **Credits**: Usage tracking and billing
- **Generations**: Content generation history and results
- **Security**: Row Level Security (RLS) for data isolation

## Tables

### users

Stores user account information and subscription details.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'STARTER', 'PRO', 'TEAM')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:

- `id`: Primary key, UUID
- `email`: User's email address (unique)
- `subscription_tier`: Subscription level (FREE, STARTER, PRO, TEAM)
- `stripe_customer_id`: Stripe customer ID for billing
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**Constraints**:

- `email` must be unique
- `subscription_tier` must be one of the allowed values
- `stripe_customer_id` can be null for free users

### credits

Tracks user credit usage and allocation.

```sql
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 5 CHECK (credits_remaining >= 0),
  credits_total INTEGER NOT NULL DEFAULT 5 CHECK (credits_total >= 0),
  resets_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:

- `id`: Primary key, UUID
- `user_id`: Foreign key to users table
- `credits_remaining`: Current available credits
- `credits_total`: Total credits allocated for current period
- `resets_at`: When credits reset (monthly)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Constraints**:

- `user_id` references users.id with CASCADE delete
- `credits_remaining` and `credits_total` must be >= 0
- One credit record per user (enforced by application logic)

### generations

Stores content generation requests and results.

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL CHECK (input_type IN ('youtube', 'audio', 'text')),
  input_url TEXT,
  transcript TEXT NOT NULL,
  outputs JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:

- `id`: Primary key, UUID
- `user_id`: Foreign key to users table
- `input_type`: Type of input (youtube, audio, text)
- `input_url`: Original input URL (for youtube/audio)
- `transcript`: Extracted or provided text content
- `outputs`: JSON object containing all generated content formats
- `status`: Current processing status
- `error_message`: Error details if generation failed
- `created_at`: Generation request timestamp
- `updated_at`: Last update timestamp

**Constraints**:

- `user_id` references users.id with CASCADE delete
- `input_type` must be one of the allowed values
- `status` must be one of the allowed values
- `transcript` cannot be empty
- `outputs` is a JSON object with specific structure

### Outputs JSON Structure

The `outputs` column contains a JSON object with the following structure:

```json
{
  "twitter_posts": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"],
  "linkedin_posts": ["post1", "post2", "post3"],
  "instagram_captions": ["caption1", "caption2"],
  "blog_article": "Full blog article content...",
  "email_newsletter": "Newsletter content with subject line...",
  "quote_graphics": ["quote1", "quote2", "quote3", "quote4", "quote5"],
  "twitter_thread": [
    "thread1",
    "thread2",
    "thread3",
    "thread4",
    "thread5",
    "thread6",
    "thread7",
    "thread8"
  ],
  "podcast_show_notes": "Show notes with timestamps...",
  "video_script_summary": "Script summary with key points...",
  "tiktok_hooks": ["hook1", "hook2", "hook3", "hook4", "hook5"]
}
```

## Relationships

### One-to-One Relationships

- `users` ↔ `credits`: Each user has exactly one credit record
- `users` ↔ `stripe_customers`: Each user can have one Stripe customer (optional)

### One-to-Many Relationships

- `users` → `generations`: Each user can have many generations
- `users` → `subscriptions`: Each user can have one active subscription

### Foreign Key Constraints

```sql
-- Credits table
ALTER TABLE credits ADD CONSTRAINT fk_credits_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Generations table
ALTER TABLE generations ADD CONSTRAINT fk_generations_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## Indexes

### Primary Indexes

All tables have primary key indexes on their `id` columns.

### Foreign Key Indexes

```sql
-- Credits table
CREATE INDEX idx_credits_user_id ON credits(user_id);

-- Generations table
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at);
```

### Composite Indexes

```sql
-- For user generation history queries
CREATE INDEX idx_generations_user_created ON generations(user_id, created_at DESC);

-- For status-based queries
CREATE INDEX idx_generations_status_created ON generations(status, created_at);
```

### Unique Indexes

```sql
-- Ensure one credit record per user
CREATE UNIQUE INDEX idx_credits_user_unique ON credits(user_id);

-- Ensure unique email addresses
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
```

## Row Level Security

### Users Table RLS

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own data (during signup)
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Credits Table RLS

```sql
-- Users can only see their own credits
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own credits
CREATE POLICY "Users can update own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert credits for users
CREATE POLICY "System can insert credits" ON credits
  FOR INSERT WITH CHECK (true);
```

### Generations Table RLS

```sql
-- Users can only see their own generations
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own generations
CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own generations
CREATE POLICY "Users can update own generations" ON generations
  FOR UPDATE USING (auth.uid() = user_id);

-- System can update generation status
CREATE POLICY "System can update generations" ON generations
  FOR UPDATE USING (true);
```

## Triggers and Functions

### Updated At Trigger

Automatically updates the `updated_at` column when a record is modified.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_updated_at BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generations_updated_at BEFORE UPDATE ON generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Credit Deduction Function

Safely deducts credits with atomic operations.

```sql
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_credits_to_deduct INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits_remaining INTO current_credits
  FROM credits
  WHERE user_id = p_user_id;

  -- Check if user has enough credits
  IF current_credits < p_credits_to_deduct THEN
    RETURN FALSE;
  END IF;

  -- Deduct credits atomically
  UPDATE credits
  SET credits_remaining = credits_remaining - p_credits_to_deduct,
      updated_at = NOW()
  WHERE user_id = p_user_id
    AND credits_remaining >= p_credits_to_deduct;

  -- Return true if update was successful
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### Monthly Credit Reset Function

Resets credits monthly based on subscription tier.

```sql
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
  new_credits INTEGER;
BEGIN
  -- Loop through all users
  FOR user_record IN
    SELECT u.id, u.subscription_tier
    FROM users u
    JOIN credits c ON c.user_id = u.id
    WHERE c.resets_at <= NOW()
  LOOP
    -- Determine credits based on subscription tier
    CASE user_record.subscription_tier
      WHEN 'FREE' THEN new_credits := 5;
      WHEN 'STARTER' THEN new_credits := 50;
      WHEN 'PRO' THEN new_credits := 200;
      WHEN 'TEAM' THEN new_credits := 500;
      ELSE new_credits := 5;
    END CASE;

    -- Reset credits
    UPDATE credits
    SET credits_remaining = new_credits,
        credits_total = new_credits,
        resets_at = NOW() + INTERVAL '1 month',
        updated_at = NOW()
    WHERE user_id = user_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## Migrations

### Initial Schema (001_initial_schema.sql)

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'STARTER', 'PRO', 'TEAM')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits table
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 5 CHECK (credits_remaining >= 0),
  credits_total INTEGER NOT NULL DEFAULT 5 CHECK (credits_total >= 0),
  resets_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL CHECK (input_type IN ('youtube', 'audio', 'text')),
  input_url TEXT,
  transcript TEXT NOT NULL,
  outputs JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at);
CREATE UNIQUE INDEX idx_credits_user_unique ON credits(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- (RLS policies as shown above)

-- Create triggers
-- (Triggers as shown above)
```

### Job Queue Optimizations (002_job_queue_optimizations.sql)

```sql
-- Add job queue table for background processing
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for job processing
CREATE INDEX idx_job_queue_status_created ON job_queue(status, created_at);
CREATE INDEX idx_job_queue_type ON job_queue(type);

-- Add RLS policy for job queue
ALTER TABLE job_queue ENABLE ROW LEVEL SECURITY;

-- System can manage job queue
CREATE POLICY "System can manage job queue" ON job_queue
  FOR ALL USING (true);
```

## Data Types

### Custom Types

```sql
-- Subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('FREE', 'STARTER', 'PRO', 'TEAM');

-- Input type enum
CREATE TYPE input_type AS ENUM ('youtube', 'audio', 'text');

-- Generation status enum
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
```

### JSON Schema Validation

```sql
-- Validate outputs JSON structure
CREATE OR REPLACE FUNCTION validate_outputs_json(json_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    json_data ? 'twitter_posts' AND
    json_data ? 'linkedin_posts' AND
    json_data ? 'instagram_captions' AND
    json_data ? 'blog_article' AND
    json_data ? 'email_newsletter' AND
    json_data ? 'quote_graphics' AND
    json_data ? 'twitter_thread' AND
    json_data ? 'podcast_show_notes' AND
    json_data ? 'video_script_summary' AND
    json_data ? 'tiktok_hooks'
  );
END;
$$ LANGUAGE plpgsql;

-- Add constraint to generations table
ALTER TABLE generations ADD CONSTRAINT check_outputs_json
  CHECK (validate_outputs_json(outputs));
```

## Performance Considerations

### Query Optimization

1. **Use indexes** for frequently queried columns
2. **Limit result sets** with appropriate WHERE clauses
3. **Use pagination** for large datasets
4. **Monitor query performance** with EXPLAIN ANALYZE

### Maintenance

1. **Regular VACUUM** to reclaim space
2. **ANALYZE** to update statistics
3. **Monitor index usage** and remove unused indexes
4. **Archive old data** to keep tables manageable

### Scaling Considerations

1. **Read replicas** for read-heavy workloads
2. **Partitioning** for large tables
3. **Connection pooling** for high concurrency
4. **Caching** for frequently accessed data

---

This schema is designed to be scalable, secure, and maintainable. For questions about specific aspects, please refer to the codebase or create an issue.
