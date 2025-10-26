# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

**Do not** create a public GitHub issue for security vulnerabilities. This could expose the vulnerability to malicious actors.

### 2. Report privately

Please report security vulnerabilities privately by:

- **Email**: security@contentmultiplier.io
- **Subject**: "Security Vulnerability Report - [Brief Description]"
- **Include**:
  - Description of the vulnerability
  - Steps to reproduce
  - Potential impact
  - Suggested fix (if any)

### 3. Response timeline

- **Initial response**: Within 24 hours
- **Status update**: Within 72 hours
- **Resolution**: Depends on severity and complexity

### 4. What to expect

- We will acknowledge receipt of your report
- We will investigate and validate the vulnerability
- We will work on a fix and coordinate disclosure
- We will credit you (if desired) in our security advisories

## Security Measures

### Authentication & Authorization

- **JWT Tokens**: Short-lived access tokens with secure httpOnly cookies
- **Password Security**: Supabase handles password hashing with bcrypt
- **Session Management**: Automatic token refresh and secure logout
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse

### Data Protection

- **Encryption in Transit**: All data transmitted over HTTPS/TLS 1.3
- **Encryption at Rest**: Database data encrypted with AES-256
- **Input Validation**: All user inputs validated with Zod schemas
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Content Security Policy and input sanitization

### API Security

- **CORS Configuration**: Restricted to allowed origins
- **CSRF Protection**: Built-in CSRF protection on forms
- **Rate Limiting**: Per-user rate limits on all endpoints
- **Input Sanitization**: All inputs sanitized before processing
- **Error Handling**: Secure error messages without sensitive data

### File Upload Security

- **File Type Validation**: Only allowed audio formats (MP3, WAV, M4A)
- **File Size Limits**: Maximum 25MB per file
- **Virus Scanning**: Planned for future implementation
- **Secure Storage**: Files stored in Supabase with access controls

### Infrastructure Security

- **HTTPS Only**: All traffic encrypted in transit
- **Security Headers**: Comprehensive security headers implemented
- **Dependency Scanning**: Automated vulnerability scanning with Dependabot
- **Regular Updates**: Dependencies updated regularly
- **Environment Isolation**: Separate environments for development and production

## Security Headers

We implement the following security headers:

```typescript
// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob: img.youtube.com i.ytimg.com; connect-src 'self' *.supabase.co *.openai.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  },
];
```

## Data Privacy

### Data Collection

We collect and process the following data:

- **Account Information**: Email address, subscription tier
- **Usage Data**: Content generation history, credit usage
- **Content Data**: User-uploaded audio files, generated content
- **Technical Data**: IP addresses, browser information, device information

### Data Processing

- **Purpose**: To provide the service and improve functionality
- **Legal Basis**: Contract performance and legitimate interests
- **Retention**: Data retained as long as account is active
- **Deletion**: Data deleted upon account closure

### Data Sharing

We do not sell or share personal data with third parties except:

- **Service Providers**: Supabase (database), OpenAI (AI processing), Vercel (hosting)
- **Legal Requirements**: When required by law or legal process
- **Business Transfers**: In case of merger or acquisition

### User Rights

Users have the right to:

- **Access**: Request copies of their data
- **Rectification**: Correct inaccurate data
- **Erasure**: Request deletion of their data
- **Portability**: Export their data
- **Restriction**: Limit processing of their data
- **Objection**: Object to processing of their data

## Security Best Practices

### For Users

- Use strong, unique passwords
- Enable two-factor authentication when available
- Keep your browser and devices updated
- Be cautious with file uploads
- Report suspicious activity immediately

### For Developers

- Follow secure coding practices
- Validate all inputs
- Use parameterized queries
- Implement proper error handling
- Keep dependencies updated
- Follow the principle of least privilege

## Incident Response

### Security Incident Process

1. **Detection**: Monitor for security events
2. **Assessment**: Evaluate severity and impact
3. **Containment**: Isolate affected systems
4. **Investigation**: Determine root cause
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Improve security measures

### Communication

- **Internal**: Notify security team immediately
- **Users**: Communicate transparently about incidents
- **Regulators**: Report as required by law
- **Public**: Issue security advisories when appropriate

## Security Testing

### Automated Testing

- **Dependency Scanning**: Dependabot checks for vulnerable packages
- **Code Analysis**: ESLint security rules
- **SAST**: Static Application Security Testing (planned)
- **DAST**: Dynamic Application Security Testing (planned)

### Manual Testing

- **Penetration Testing**: Regular security assessments
- **Code Reviews**: Security-focused code reviews
- **Threat Modeling**: Regular threat model updates
- **Red Team Exercises**: Simulated attacks (planned)

## Compliance

### Standards

We strive to comply with:

- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **SOC 2**: Security and availability controls (planned)
- **ISO 27001**: Information security management (planned)

### Audits

- **Internal Audits**: Regular security assessments
- **External Audits**: Third-party security evaluations (planned)
- **Compliance Reviews**: Regular compliance checks

## Contact Information

### Security Team

- **Email**: security@contentmultiplier.io
- **Response Time**: 24 hours for initial response
- **PGP Key**: Available upon request

### General Support

- **Email**: support@contentmultiplier.io
- **Documentation**: https://docs.contentmultiplier.io
- **Status Page**: https://status.contentmultiplier.io

## Security Updates

We will update this security policy as needed. Significant changes will be communicated through:

- Email notifications to registered users
- Updates to this document
- Security advisories on our website

## Acknowledgments

We appreciate security researchers who help us improve our security posture. We maintain a Hall of Fame for responsible disclosure contributors.

---

**Last Updated**: January 2024
**Next Review**: July 2024

For questions about this security policy, please contact security@contentmultiplier.io.
