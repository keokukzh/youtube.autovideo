# Authentication API

## Overview

ContentMultiplier.io uses Supabase Auth for user authentication. This document covers the authentication flow and related API endpoints.

## Authentication Flow

### 1. User Registration

**Endpoint:** `POST /auth/v1/signup` (Supabase)

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": null
}
```

### 2. User Login

**Endpoint:** `POST /auth/v1/token` (Supabase)

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

### 3. Session Management

**Get Current User:**

```javascript
const {
  data: { user },
} = await supabase.auth.getUser();
```

**Refresh Session:**

```javascript
const { data, error } = await supabase.auth.refreshSession();
```

**Sign Out:**

```javascript
const { error } = await supabase.auth.signOut();
```

## API Endpoints

### POST /api/auth/logout

Log out the current user and invalidate their session.

**Headers:**

- `Authorization: Bearer <session_token>` (required)

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Authentication required"
}
```

## Session Tokens

### JWT Structure

Session tokens are JWT tokens with the following structure:

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_uuid",
    "email": "user@example.com",
    "aud": "authenticated",
    "role": "authenticated",
    "iat": 1234567890,
    "exp": 1234567890
  }
}
```

### Token Validation

All API endpoints validate tokens by:

1. Verifying the JWT signature
2. Checking token expiration
3. Validating the user exists and is active
4. Checking user permissions

## User Profiles

### User Data Structure

```typescript
interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'starter' | 'pro' | 'team';
  credits: number;
}
```

### Profile Management

**Get User Profile:**

```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single();
```

**Update User Profile:**

```javascript
const { data, error } = await supabase
  .from('users')
  .update({ subscription_tier: 'pro' })
  .eq('id', user.id);
```

## Credits System

### Credit Management

Each user has a credit balance that is used for content generation:

```typescript
interface Credits {
  user_id: string;
  credits: number;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}
```

### Credit Operations

**Get User Credits:**

```javascript
const { data, error } = await supabase
  .from('credits')
  .select('*')
  .eq('user_id', user.id)
  .single();
```

**Atomic Credit Deduction:**

```javascript
const { data, error } = await supabase.rpc('deduct_credits_atomic', {
  p_user_id: user.id,
  p_amount: 1,
});
```

## Rate Limiting

### Authentication Endpoints

- **Sign Up:** 5 requests per hour per IP
- **Sign In:** 10 requests per hour per IP
- **Password Reset:** 3 requests per hour per email

### Rate Limit Headers

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1234567890
```

## Security Features

### Password Requirements

- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one letter and one number

### Session Security

- Tokens expire after 1 hour
- Refresh tokens expire after 30 days
- Sessions are invalidated on logout
- Multiple device sessions are supported

### CSRF Protection

- All state-changing operations require CSRF tokens
- Tokens are validated on the server
- Tokens are rotated on each request

## Error Handling

### Common Authentication Errors

**Invalid Credentials:**

```json
{
  "error": "Invalid login credentials"
}
```

**Email Already Registered:**

```json
{
  "error": "User already registered"
}
```

**Token Expired:**

```json
{
  "error": "JWT expired"
}
```

**Rate Limit Exceeded:**

```json
{
  "error": "Too many requests"
}
```

## Best Practices

### Client-Side

1. **Token Storage:** Store tokens securely (httpOnly cookies recommended)
2. **Token Refresh:** Implement automatic token refresh
3. **Error Handling:** Handle authentication errors gracefully
4. **Session Management:** Clear tokens on logout
5. **Input Validation:** Validate inputs before API calls

### Server-Side

1. **Token Validation:** Always validate tokens on protected endpoints
2. **Rate Limiting:** Implement rate limiting for auth endpoints
3. **Logging:** Log authentication events for security monitoring
4. **Error Messages:** Use generic error messages to prevent information leakage
5. **Session Cleanup:** Clean up expired sessions regularly

## Integration Examples

### React Hook

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
```

### Next.js Middleware

```javascript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  // Redirect authenticated users from auth pages
  if (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup')
  ) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Redirect unauthenticated users to login
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/login', '/signup'],
};
```
