# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] All feature branches merged to main

### Security
- [ ] No secrets in code
- [ ] `.env` files not committed
- [ ] Dependencies updated (`npm audit` shows no critical issues)
- [ ] Security headers configured
- [ ] CORS properly configured

### Content
- [ ] Content types tested in Strapi
- [ ] Sample content added
- [ ] Images optimized
- [ ] SEO metadata complete

## Vercel Deployment (Frontend)

### Setup
- [ ] Vercel account created
- [ ] Project linked to GitHub repository
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Environment Variables
- [ ] `NEXT_PUBLIC_STRAPI_URL` set (production CMS URL)
- [ ] `REVALIDATION_SECRET` set (random secure string)
- [ ] `NEXT_PUBLIC_GA_ID` set (if using analytics)

### Configuration
- [ ] Build settings verified (auto-detected or manual)
- [ ] Node.js version specified (20.x)
- [ ] Environment variables marked as "Sensitive"
- [ ] Preview deployments configured

### Testing
- [ ] Preview deployment successful
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] API connections working
- [ ] ISR working (content updates)

## Azure Deployment (CMS)

### Resources Created
- [ ] Resource Group created
- [ ] App Service Plan created (B1 or higher)
- [ ] Web App created (Node 20 LTS)
- [ ] PostgreSQL database created
- [ ] Application Insights enabled (optional)

### Database Setup
- [ ] PostgreSQL server created
- [ ] Database created
- [ ] Firewall rules configured
- [ ] SSL enabled
- [ ] Connection string tested

### Environment Variables
- [ ] `HOST=0.0.0.0`
- [ ] `PORT=8080`
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_CLIENT=postgres`
- [ ] `DATABASE_HOST` set
- [ ] `DATABASE_PORT=5432`
- [ ] `DATABASE_NAME` set
- [ ] `DATABASE_USERNAME` set
- [ ] `DATABASE_PASSWORD` set
- [ ] `DATABASE_SSL=true`
- [ ] `APP_KEYS` set (4 random strings)
- [ ] `API_TOKEN_SALT` set
- [ ] `ADMIN_JWT_SECRET` set
- [ ] `TRANSFER_TOKEN_SALT` set
- [ ] `JWT_SECRET` set

### Deployment
- [ ] GitHub deployment configured
- [ ] Initial deployment successful
- [ ] Admin panel accessible
- [ ] Admin user created
- [ ] Content types visible

## Post-Deployment

### Strapi Configuration
- [ ] Admin password is strong
- [ ] Public permissions configured
  - [ ] Blog: find, findOne
  - [ ] Service: find, findOne
  - [ ] Testimonial: find, findOne
  - [ ] FAQ: find, findOne
  - [ ] Homepage: find
- [ ] API tokens created for webhooks
- [ ] Rate limiting configured

### Content Population
- [ ] Homepage content added
- [ ] Services added and published
- [ ] Testimonials added and published
- [ ] Blog posts added and published
- [ ] FAQs added and published
- [ ] All images uploaded and optimized

### Integration Testing
- [ ] Frontend fetches CMS data
- [ ] Blog posts display correctly
- [ ] Services page populated
- [ ] Testimonials showing
- [ ] Homepage hero working
- [ ] Images loading from CMS
- [ ] ISR revalidation working

### SEO & Analytics
- [ ] Meta tags correct
- [ ] OG images working
- [ ] Sitemap accessible
- [ ] robots.txt configured
- [ ] Google Analytics working (if enabled)
- [ ] Google Search Console setup
- [ ] Submit sitemap to Google

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Fonts loading efficiently
- [ ] No console errors
- [ ] Mobile responsive

### Monitoring
- [ ] Error tracking configured
- [ ] Uptime monitoring set up
- [ ] Backup strategy in place
- [ ] Database backups enabled
- [ ] Recovery plan documented

## GitHub Actions

### Secrets Configured
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`
- [ ] `NEXT_PUBLIC_STRAPI_URL`
- [ ] `AZURE_WEBAPP_NAME` (if using Azure)
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` (if using Azure)

### Workflows
- [ ] CI workflow runs on PRs
- [ ] Deploy workflow runs on main
- [ ] All workflows passing
- [ ] Branch protection rules configured

## DNS & Domain

### DNS Configuration
- [ ] A record pointing to Vercel (frontend)
- [ ] CNAME for www (if applicable)
- [ ] A record or CNAME for CMS subdomain
- [ ] SSL certificates active
- [ ] DNS propagation complete

### Verification
- [ ] Main domain accessible
- [ ] WWW redirects correctly
- [ ] HTTPS working
- [ ] CMS accessible at subdomain
- [ ] No mixed content warnings

## Documentation

### Updated
- [ ] README.md reflects production URLs
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created
- [ ] Contact information current

### Team Access
- [ ] Vercel access granted
- [ ] Azure access granted
- [ ] GitHub access granted
- [ ] Strapi admin accounts created
- [ ] Documentation shared

## Launch

### Final Checks
- [ ] All checklist items complete
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)
- [ ] Rollback plan prepared
- [ ] Support team briefed

### Go Live
- [ ] DNS switched to production
- [ ] Verification tests passed
- [ ] Monitoring active
- [ ] First content published
- [ ] Social media announcement (optional)

### Post-Launch (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify analytics tracking
- [ ] Review user feedback
- [ ] Address any issues

### Post-Launch (First Week)
- [ ] Review performance data
- [ ] Analyze user behavior
- [ ] Optimize based on metrics
- [ ] Address user feedback
- [ ] Plan next iteration

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review analytics

### Weekly
- [ ] Review performance metrics
- [ ] Check for dependency updates
- [ ] Backup verification

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Content review
- [ ] Update documentation

### Quarterly
- [ ] Major dependency updates
- [ ] Infrastructure review
- [ ] Cost optimization
- [ ] Feature planning

---

## Notes

Date Deployed: ___________
Deployed By: ___________
Production URLs:
- Frontend: ___________
- CMS: ___________

Issues Encountered:
___________________________________________
___________________________________________

Lessons Learned:
___________________________________________
___________________________________________
