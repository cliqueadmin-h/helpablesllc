# Vercel Configuration

This file configures your Next.js frontend deployment on Vercel.

## Setup Instructions

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project (from the frontend directory):
```bash
cd frontend
vercel link
```

4. Set environment variables:
```bash
vercel env add NEXT_PUBLIC_STRAPI_URL
vercel env add REVALIDATION_SECRET
```

5. Deploy:
```bash
vercel --prod
```

## Environment Variables

Add these in your Vercel dashboard:

- `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL (e.g., https://cms.helpables.io)
- `REVALIDATION_SECRET`: Secret key for on-demand revalidation
- `NEXT_PUBLIC_GA_ID`: (Optional) Google Analytics ID

## Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., helpables.com)
4. Follow the DNS configuration instructions

## Automatic Deployments

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

## On-Demand Revalidation

To revalidate a page after CMS content changes, create a webhook in Strapi:

URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET&path=/`

Replace `/` with the specific path you want to revalidate.
