# ContentMultiplier.io API Documentation

## Overview

The ContentMultiplier.io API provides endpoints for content generation, user management, and authentication. All API endpoints are RESTful and return JSON responses.

## Base URL

```
https://contentmultiplier.io/api
```

## Authentication

Most endpoints require authentication using Supabase Auth. Include the user's session token in the Authorization header:

```
Authorization: Bearer <session_token>
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Generation endpoints**: 10 requests per 15 minutes per user
- **General API**: 100 requests per 15 minutes per user
- **Authentication**: 20 requests per 15 minutes per user

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit resets

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `402`: Payment Required (insufficient credits)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Endpoints

### Content Generation

#### POST /api/generate

Generate content from various input types.

**Request Body:**

- `input_type` (string, required): Type of input - "youtube", "audio", or "text"
- `input_url` (string, optional): YouTube URL (required for youtube input_type)
- `input_text` (string, optional): Text content (required for text input_type)
- `file` (File, optional): Audio file (required for audio input_type)

**Response:**

```json
{
  "success": true,
  "data": {
    "generation_id": "uuid",
    "status": "pending",
    "poll_url": "/api/generation/{generation_id}"
  },
  "message": "Generation queued successfully"
}
```

#### GET /api/generation/{id}

Get the status and results of a content generation.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "outputs": {
      "twitter_posts": ["tweet1", "tweet2"],
      "linkedin_posts": ["post1", "post2"],
      "instagram_captions": ["caption1", "caption2"],
      "blog_article": "article content",
      "email_newsletter": "newsletter content",
      "quote_graphics": ["quote1", "quote2"],
      "twitter_thread": ["thread1", "thread2"],
      "podcast_show_notes": "show notes",
      "video_script_summary": "script summary",
      "tiktok_hooks": ["hook1", "hook2"]
    }
  }
}
```

### Authentication

#### POST /api/auth/logout

Log out the current user.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Worker

#### POST /api/worker/process

Process pending content generation jobs. This endpoint is called by cron jobs or client-side polling.

**Headers:**

- `Authorization: Bearer <cron_secret>` (required)

**Response:**

```json
{
  "success": true,
  "job_id": "uuid",
  "processing_time_ms": 300000
}
```

## Content Outputs

All content generation produces 10 different formats:

1. **Twitter Posts** (5x): 280-character posts with hashtags
2. **LinkedIn Posts** (3x): Professional posts up to 1,300 characters
3. **Instagram Captions** (2x): Engaging captions up to 2,200 characters
4. **Blog Article** (1x): 1,500-2,500 word SEO-optimized article
5. **Email Newsletter** (1x): Subject line + 500-word content
6. **Quote Graphics** (5x): Powerful quotes for design tools
7. **Twitter Thread** (1x): 8-12 connected tweets
8. **Podcast Show Notes** (1x): Bullet points with timestamps
9. **Video Script Summary** (1x): Key talking points and themes
10. **TikTok/Reels Hooks** (5x): Attention-grabbing hooks

## Input Validation

### YouTube URLs

- Must be valid YouTube URLs (youtube.com or youtu.be)
- Supports watch URLs and short URLs

### Audio Files

- Supported formats: MP3, WAV, M4A, MP4
- Maximum size: 25MB
- Minimum duration: 30 seconds

### Text Input

- Minimum length: 100 characters
- Maximum length: 50,000 characters
- Must contain meaningful content (not just whitespace)

## Credits System

Each content generation consumes 1 credit and produces all 10 formats. Credits are deducted atomically to prevent race conditions.

## Webhooks

The system supports webhooks for generation completion notifications. Configure webhook URLs in your account settings.

## SDKs

Official SDKs are available for:

- JavaScript/TypeScript
- Python
- Node.js

## Support

For API support, contact:

- Email: api-support@contentmultiplier.io
- Documentation: https://docs.contentmultiplier.io
- Status Page: https://status.contentmultiplier.io
