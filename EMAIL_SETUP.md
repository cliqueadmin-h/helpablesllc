# Email Configuration for Contact Form

## Required Environment Variables

Add these to your Railway CMS service environment variables:

### SMTP Configuration (Gmail Example)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_DEFAULT_FROM=noreply@helpables.org
SMTP_DEFAULT_REPLYTO=cliqueadmin@helpables.org
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Helpables CMS"
   - Copy the 16-character password
   - Use this as `SMTP_PASSWORD`

## Alternative: SendGrid (Recommended for Production)

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_DEFAULT_FROM=noreply@helpables.org
SMTP_DEFAULT_REPLYTO=cliqueadmin@helpables.org
```

### SendGrid Setup:
1. Sign up at: https://sendgrid.com (Free tier: 100 emails/day)
2. Create API Key: Settings → API Keys → Create API Key
3. Use API key as `SMTP_PASSWORD`
4. Verify sender email: Settings → Sender Authentication

## Alternative: Resend (Modern & Developer-Friendly)

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USERNAME=resend
SMTP_PASSWORD=your-resend-api-key
SMTP_DEFAULT_FROM=noreply@helpables.org
SMTP_DEFAULT_REPLYTO=cliqueadmin@helpables.org
```

### Resend Setup:
1. Sign up at: https://resend.com (Free tier: 3,000 emails/month)
2. Create API Key in dashboard
3. Add domain or use resend.dev for testing

## Testing Email Locally

You can use Mailtrap for local testing:

```
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
```

## How It Works

1. User submits contact form on frontend
2. Data is saved to Strapi database
3. Lifecycle hook triggers after creation
4. Email is sent to cliqueadmin@helpables.org
5. Email includes all form data and submission time

## Email Format

The admin will receive an email with:
- From: Contact submitter's name
- Reply-To: Contact submitter's email (for easy response)
- Subject: "New Contact Form Submission: [subject]"
- Body: All form fields formatted in HTML
