# Troubleshooting Guide

This guide helps you resolve common issues when using ContentMultiplier.io.

## Table of Contents

- [Common Issues](#common-issues)
- [Authentication Problems](#authentication-problems)
- [Content Generation Issues](#content-generation-issues)
- [Database Issues](#database-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [Getting Help](#getting-help)

## Common Issues

### "Module not found" errors

**Problem**: Getting "Module not found" errors when running the application.

**Solutions**:

1. Clear Next.js cache:

   ```bash
   rm -rf .next
   npm run dev
   ```

2. Delete node_modules and reinstall:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check import paths:
   - Ensure imports use the correct path
   - Check if the file exists
   - Verify file extensions (.ts, .tsx)

### TypeScript compilation errors

**Problem**: TypeScript errors preventing the build.

**Solutions**:

1. Run type checking:

   ```bash
   npm run type-check
   ```

2. Check for missing type definitions:

   ```bash
   npm install --save-dev @types/package-name
   ```

3. Update TypeScript configuration if needed

### Build failures

**Problem**: Application fails to build.

**Solutions**:

1. Check for TypeScript errors:

   ```bash
   npm run type-check
   ```

2. Check for linting errors:

   ```bash
   npm run lint
   ```

3. Check for formatting issues:

   ```bash
   npm run format:check
   ```

4. Clear cache and rebuild:
   ```bash
   rm -rf .next
   npm run build
   ```

## Authentication Problems

### "User not authenticated" errors

**Problem**: Getting authentication errors when accessing protected routes.

**Solutions**:

1. Check if user is logged in:
   - Look for user data in browser dev tools
   - Check if auth cookies are present

2. Verify Supabase configuration:
   - Check environment variables
   - Verify Supabase project settings
   - Check RLS policies

3. Clear browser data:
   - Clear cookies and local storage
   - Try in incognito mode

### Login not working

**Problem**: Unable to log in with valid credentials.

**Solutions**:

1. Check email verification:
   - Look for verification email
   - Check spam folder
   - Resend verification if needed

2. Verify credentials:
   - Check email and password
   - Try password reset if needed

3. Check Supabase auth settings:
   - Verify email confirmation is enabled
   - Check auth providers configuration

### Session expires quickly

**Problem**: User gets logged out frequently.

**Solutions**:

1. Check token expiration settings
2. Verify refresh token logic
3. Check for timezone issues

## Content Generation Issues

### Generation fails immediately

**Problem**: Content generation fails right after starting.

**Solutions**:

1. Check credits:
   - Verify user has sufficient credits
   - Check credit deduction logic

2. Validate input:
   - Check input format and size
   - Verify required fields are present

3. Check API keys:
   - Verify OpenAI API key is valid
   - Check API key permissions

### Generation stuck in "processing" status

**Problem**: Generation never completes.

**Solutions**:

1. Check worker process:
   - Verify worker is running
   - Check worker logs

2. Check OpenAI API:
   - Verify API key is working
   - Check rate limits
   - Verify model availability

3. Check database:
   - Verify generation record exists
   - Check for database locks

### Poor quality content generation

**Problem**: Generated content is low quality or irrelevant.

**Solutions**:

1. Check input quality:
   - Ensure input is clear and relevant
   - Check transcript quality

2. Adjust prompts:
   - Review system prompts
   - Test with different inputs

3. Check AI model settings:
   - Verify temperature settings
   - Check token limits

### Audio transcription issues

**Problem**: Audio files not being transcribed correctly.

**Solutions**:

1. Check file format:
   - Ensure file is MP3, WAV, or M4A
   - Check file size (max 25MB)

2. Check audio quality:
   - Ensure clear audio
   - Check for background noise

3. Check Whisper API:
   - Verify API key
   - Check rate limits

## Database Issues

### "Row Level Security" errors

**Problem**: Getting RLS policy violation errors.

**Solutions**:

1. Check user authentication:
   - Verify user is logged in
   - Check user ID in requests

2. Review RLS policies:
   - Check policy conditions
   - Verify user permissions

3. Check database connection:
   - Verify Supabase credentials
   - Check network connectivity

### Data not saving

**Problem**: Data not being saved to database.

**Solutions**:

1. Check database connection:
   - Verify Supabase URL and keys
   - Check network connectivity

2. Check data validation:
   - Verify data format
   - Check required fields

3. Check permissions:
   - Verify user has write access
   - Check RLS policies

### Slow database queries

**Problem**: Database queries are slow.

**Solutions**:

1. Check query performance:
   - Use EXPLAIN ANALYZE
   - Check for missing indexes

2. Optimize queries:
   - Use proper WHERE clauses
   - Limit result sets

3. Check database resources:
   - Monitor CPU and memory usage
   - Check connection pool

## Performance Issues

### Slow page loads

**Problem**: Pages take too long to load.

**Solutions**:

1. Check bundle size:

   ```bash
   npm run build
   # Check .next/static/chunks/ for large files
   ```

2. Optimize images:
   - Use next/image component
   - Compress images
   - Use appropriate formats

3. Check network:
   - Test with different connections
   - Check CDN performance

### High memory usage

**Problem**: Application uses too much memory.

**Solutions**:

1. Check for memory leaks:
   - Use browser dev tools
   - Monitor memory usage over time

2. Optimize components:
   - Use React.memo for expensive components
   - Implement proper cleanup

3. Check for large data sets:
   - Paginate large lists
   - Use virtual scrolling

### Slow content generation

**Problem**: Content generation takes too long.

**Solutions**:

1. Check AI API performance:
   - Monitor response times
   - Check rate limits

2. Optimize prompts:
   - Reduce prompt length
   - Use more specific instructions

3. Implement caching:
   - Cache similar requests
   - Use background processing

## Browser Compatibility

### JavaScript errors in older browsers

**Problem**: Application doesn't work in older browsers.

**Solutions**:

1. Check browser support:
   - Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
   - Check polyfills for older browsers

2. Check JavaScript features:
   - Avoid unsupported features
   - Use Babel for transpilation

### CSS not loading

**Problem**: Styles not appearing correctly.

**Solutions**:

1. Check Tailwind CSS:
   - Verify Tailwind configuration
   - Check for missing classes

2. Check build process:
   - Ensure CSS is being built
   - Check for build errors

3. Check browser cache:
   - Clear browser cache
   - Hard refresh (Ctrl+F5)

## Getting Help

### Before asking for help

1. **Check this guide** for common solutions
2. **Search existing issues** on GitHub
3. **Check the logs** for error messages
4. **Try the solutions** listed above

### When asking for help

Include the following information:

1. **Description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - Operating system
   - Browser and version
   - Node.js version
   - Application version

5. **Error messages** and logs
6. **Screenshots** if applicable

### Contact methods

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general help
- **Email**: support@contentmultiplier.io for urgent issues

### Debugging tools

1. **Browser Dev Tools**:
   - Console for JavaScript errors
   - Network tab for API issues
   - Application tab for storage issues

2. **Next.js Debug Mode**:

   ```bash
   DEBUG=* npm run dev
   ```

3. **Supabase Debug**:
   - Check Supabase dashboard logs
   - Use Supabase CLI for local debugging

4. **Database Debugging**:
   - Use Supabase SQL editor
   - Check query performance
   - Review RLS policies

### Common error codes

| Error Code | Description           | Solution                            |
| ---------- | --------------------- | ----------------------------------- |
| 400        | Bad Request           | Check request format and validation |
| 401        | Unauthorized          | Check authentication and login      |
| 402        | Payment Required      | Check credits and subscription      |
| 403        | Forbidden             | Check permissions and RLS policies  |
| 404        | Not Found             | Check URL and resource existence    |
| 429        | Too Many Requests     | Wait and retry, check rate limits   |
| 500        | Internal Server Error | Check server logs and configuration |

---

If you can't find a solution in this guide, please create an issue on GitHub with the information requested above.
