# Security Best Practices

## Environment Variables

### Never Commit Secrets
- All `.env` files are gitignored
- Use `.env.example` as templates only
- Store production secrets in:
  - Vercel: Project settings
  - Azure: Application settings
  - GitHub: Repository secrets

### Generate Strong Secrets

For Strapi secrets, use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## API Security

### Strapi CMS

1. **Admin Access**
   - Use strong passwords
   - Enable 2FA if available
   - Limit admin access to specific IPs (production)

2. **API Tokens**
   - Create separate tokens for different services
   - Use read-only tokens when possible
   - Rotate tokens regularly

3. **Rate Limiting**
   - Configure in `cms/config/middlewares.js`
   - Prevent brute force attacks

4. **CORS**
   - Configure allowed origins
   - Don't use `*` in production

### Frontend

1. **API Routes**
   - Validate secrets in API routes
   - Don't expose sensitive endpoints publicly

2. **Content Security Policy**
   - Configured in Next.js headers
   - Prevents XSS attacks

## Database Security

### PostgreSQL (Production)

1. **Connection**
   - Use SSL/TLS connections
   - Don't expose database publicly
   - Use Azure Private Link or VPC

2. **Credentials**
   - Use strong passwords
   - Rotate credentials regularly
   - Use managed identities when possible

3. **Backups**
   - Enable automated backups
   - Test restore procedures
   - Store backups securely

## Deployment Security

### Vercel

1. **Environment Variables**
   - Mark sensitive variables as "Sensitive"
   - Different values for preview/production

2. **Deployment Protection**
   - Enable Vercel Authentication for preview deployments
   - Use deployment protection rules

### Azure

1. **Managed Identity**
   - Use for database connections
   - Avoid passwords in config

2. **Network Security**
   - Use Virtual Networks
   - Configure firewall rules
   - Enable DDoS protection

3. **Application Security**
   - Keep Node.js runtime updated
   - Enable security headers
   - Use Azure Security Center

## Dependencies

### Keep Updated

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Automated Updates

- Use Dependabot (enabled by default)
- Review and test updates before merging
- Pin critical dependencies

## Headers & HTTPS

### Security Headers

Next.js automatically sets secure headers. Verify in `next.config.mjs`:

```javascript
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### Force HTTPS

- Vercel: Automatic
- Azure: Enable in portal

## Monitoring

### Log Monitoring

1. **Vercel**
   - Check runtime logs
   - Set up log drains for long-term storage

2. **Azure**
   - Enable Application Insights
   - Set up alerts for errors
   - Monitor failed requests

### Security Scanning

1. **Code Scanning**
   - Use GitHub Code Scanning
   - Enable Dependabot alerts

2. **Vulnerability Scanning**
   - Run `npm audit` regularly
   - Use Snyk or similar tools

## Incident Response

### In Case of Breach

1. **Immediate Actions**
   - Rotate all secrets
   - Review access logs
   - Disable compromised accounts

2. **Investigation**
   - Check application logs
   - Review recent deployments
   - Identify entry point

3. **Remediation**
   - Patch vulnerabilities
   - Update dependencies
   - Deploy fixes

4. **Post-Incident**
   - Document incident
   - Update security procedures
   - Notify affected users if required

## Compliance

### GDPR Considerations

- Store only necessary data
- Implement data deletion procedures
- Add privacy policy
- Cookie consent (if using analytics)

### Data Encryption

- Data in transit: HTTPS/TLS
- Data at rest: Azure encryption
- Database encryption: Enable in PostgreSQL

## Checklist

Before going to production:

- [ ] All environment variables set correctly
- [ ] Strong, unique secrets generated
- [ ] Database uses SSL connections
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Dependencies updated
- [ ] npm audit shows no critical issues
- [ ] Admin passwords are strong
- [ ] 2FA enabled where possible
- [ ] API tokens are read-only when possible

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Strapi Security](https://docs.strapi.io/dev-docs/security)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)

---

Security is an ongoing process. Review and update these practices regularly.
