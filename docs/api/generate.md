# Content Generation API

## POST /api/generate

Generate content from various input types using AI-powered repurposing.

### Request

**Method:** `POST`  
**Content-Type:** `multipart/form-data`  
**Authentication:** Required (Bearer token)

#### Parameters

| Parameter    | Type   | Required | Description                                   |
| ------------ | ------ | -------- | --------------------------------------------- |
| `input_type` | string | Yes      | Type of input: "youtube", "audio", or "text"  |
| `input_url`  | string | No       | YouTube URL (required for youtube input_type) |
| `input_text` | string | No       | Text content (required for text input_type)   |
| `file`       | File   | No       | Audio file (required for audio input_type)    |

#### Input Type Examples

**YouTube Input:**

```javascript
const formData = new FormData();
formData.append('input_type', 'youtube');
formData.append('input_url', 'https://youtube.com/watch?v=example');
```

**Audio Input:**

```javascript
const formData = new FormData();
formData.append('input_type', 'audio');
formData.append('file', audioFile); // File object
```

**Text Input:**

```javascript
const formData = new FormData();
formData.append('input_type', 'text');
formData.append('input_text', 'Your text content here...');
```

### Response

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "generation_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "pending",
    "poll_url": "/api/generation/123e4567-e89b-12d3-a456-426614174000"
  },
  "message": "Generation queued successfully"
}
```

#### Error Responses

**400 Bad Request - Validation Error:**

```json
{
  "success": false,
  "error": "Validation error: Invalid input type"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "error": "Authentication required"
}
```

**402 Payment Required - Insufficient Credits:**

```json
{
  "success": false,
  "error": "Insufficient credits"
}
```

**429 Too Many Requests:**

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 900 seconds."
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

### Rate Limiting

- **Limit:** 10 requests per 15 minutes per user
- **Headers:** Rate limit information included in response headers

### Validation Rules

#### YouTube URLs

- Must be valid YouTube URLs
- Supports `youtube.com/watch?v=` and `youtu.be/` formats
- URL must be accessible and contain video content

#### Audio Files

- **Supported formats:** MP3, WAV, M4A, MP4
- **Maximum size:** 25MB
- **Minimum duration:** 30 seconds
- **Maximum duration:** 2 hours

#### Text Input

- **Minimum length:** 100 characters
- **Maximum length:** 50,000 characters
- **Content:** Must contain meaningful text (not just whitespace)

### Processing Flow

1. **Validation:** Input is validated against type-specific rules
2. **Authentication:** User session is verified
3. **Rate Limiting:** Request count is checked against user limits
4. **Credits:** User credits are verified and deducted atomically
5. **Queueing:** Generation job is created and queued for processing
6. **Response:** Immediate response with generation ID and poll URL

### Polling for Results

Use the `poll_url` from the response to check generation status:

```javascript
const response = await fetch(
  '/api/generation/123e4567-e89b-12d3-a456-426614174000'
);
const data = await response.json();

if (data.data.status === 'completed') {
  // Access generated content
  const outputs = data.data.outputs;
} else if (data.data.status === 'failed') {
  // Handle error
  console.error(data.data.error_message);
}
```

### Generated Content

Each successful generation produces 10 different content formats:

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

### Example Usage

```javascript
// Generate content from YouTube video
async function generateFromYouTube(url) {
  const formData = new FormData();
  formData.append('input_type', 'youtube');
  formData.append('input_url', url);

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    // Poll for results
    return pollForResults(data.data.poll_url);
  } else {
    throw new Error(data.error);
  }
}

// Poll for generation results
async function pollForResults(pollUrl) {
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(pollUrl);
    const data = await response.json();

    if (data.data.status === 'completed') {
      return data.data.outputs;
    } else if (data.data.status === 'failed') {
      throw new Error(data.data.error_message);
    }

    // Wait 5 seconds before next poll
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Generation timeout');
}
```

### Best Practices

1. **Error Handling:** Always check the `success` field in responses
2. **Rate Limiting:** Implement exponential backoff for rate limit errors
3. **Polling:** Use reasonable polling intervals (5-10 seconds)
4. **File Uploads:** Validate file size and type before upload
5. **Input Validation:** Validate inputs client-side before API calls
6. **Credits:** Check user credits before initiating generation
7. **Timeout:** Set reasonable timeouts for long-running operations
