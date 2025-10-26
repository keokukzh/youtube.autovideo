-- 1. Add job queue fields to generations table
ALTER TABLE generations 
  ADD COLUMN error_message TEXT,
  ADD COLUMN processing_time_ms INTEGER,
  ADD COLUMN retry_count INTEGER DEFAULT 0,
  ADD COLUMN max_retries INTEGER DEFAULT 3,
  ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- 2. Create index for job queue polling
CREATE INDEX idx_generations_queue ON generations(status, scheduled_at) 
  WHERE status IN ('pending', 'processing');

-- 3. Create atomic credit deduction function (FIX RACE CONDITION)
CREATE OR REPLACE FUNCTION deduct_credits_atomic(
  p_user_id UUID, 
  p_amount INTEGER DEFAULT 1
) RETURNS TABLE(success BOOLEAN, remaining INTEGER, error_msg TEXT) AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  -- Use SELECT FOR UPDATE to lock the row
  UPDATE credits 
  SET 
    credits_remaining = credits_remaining - p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND credits_remaining >= p_amount
  RETURNING credits_remaining INTO v_remaining;
  
  IF FOUND THEN
    RETURN QUERY SELECT TRUE, v_remaining, NULL::TEXT;
  ELSE
    RETURN QUERY SELECT FALSE, 0, 'Insufficient credits'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Create function to get next pending job (for worker)
CREATE OR REPLACE FUNCTION get_next_pending_job()
RETURNS TABLE(
  job_id UUID,
  user_id UUID,
  input_type TEXT,
  input_url TEXT,
  transcript TEXT
) AS $$
BEGIN
  RETURN QUERY
  UPDATE generations
  SET 
    status = 'processing',
    started_at = NOW(),
    updated_at = NOW()
  WHERE id = (
    SELECT id FROM generations
    WHERE status = 'pending'
      AND scheduled_at <= NOW()
      AND retry_count < max_retries
    ORDER BY scheduled_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED  -- Critical: prevents race conditions
  )
  RETURNING id, generations.user_id, generations.input_type, 
            generations.input_url, generations.transcript;
END;
$$ LANGUAGE plpgsql;

-- 5. Create transcript cache table (SAVES MONEY)
CREATE TABLE IF NOT EXISTS transcript_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'audio_hash', 'text_hash')),
  source_identifier TEXT NOT NULL,
  transcript TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  UNIQUE(source_type, source_identifier)
);

CREATE INDEX idx_transcript_cache_lookup ON transcript_cache(source_type, source_identifier);

-- 6. Create rate limiting table (FREE RATE LIMITING)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(user_id, endpoint, window_start);

-- 7. Function to check rate limit (10 requests per 10 minutes)
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 10
) RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, reset_at TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_count INTEGER;
  v_reset_at TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := DATE_TRUNC('minute', NOW()) - (EXTRACT(MINUTE FROM NOW())::INTEGER % p_window_minutes) * INTERVAL '1 minute';
  v_reset_at := v_window_start + (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get or create rate limit record
  INSERT INTO rate_limits (user_id, endpoint, window_start, request_count)
  VALUES (p_user_id, p_endpoint, v_window_start, 1)
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    created_at = NOW()
  RETURNING rate_limits.request_count INTO v_count;
  
  IF v_count <= p_max_requests THEN
    RETURN QUERY SELECT TRUE, p_max_requests - v_count, v_reset_at;
  ELSE
    RETURN QUERY SELECT FALSE, 0, v_reset_at;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_status ON generations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_generations_user_input_type ON generations(user_id, input_type);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- 9. Function to cleanup old rate limit records (run via cron)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 10. Function to cleanup old transcript cache (optional - keep popular ones)
CREATE OR REPLACE FUNCTION cleanup_old_transcripts()
RETURNS void AS $$
BEGIN
  DELETE FROM transcript_cache 
  WHERE accessed_at < NOW() - INTERVAL '30 days'
    AND access_count < 3;  -- Keep frequently accessed transcripts
END;
$$ LANGUAGE plpgsql;
