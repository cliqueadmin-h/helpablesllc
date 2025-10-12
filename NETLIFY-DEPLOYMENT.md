# Netlify Deployment Guide

## 🚀 Deploy Your JAMstack Site to Netlify

### Overview
- **Frontend**: Netlify (Next.js)
- **Backend**: Railway (Strapi CMS + PostgreSQL)
- **Total Cost**: ~$5-10/month (Railway) + Free (Netlify)

---

## Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it: `helpables-jamstack` (or your preferred name)
3. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/helpables-jamstack.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Strapi CMS to Railway

### 2.1 Sign up for Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. You get $5/month free credit

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `helpables-jamstack` repository
4. Railway will detect the Dockerfile

### 2.3 Configure CMS Service
1. Click on the deployed service
2. Go to "Variables" tab
3. Add these environment variables:

```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generate-new-random-key>
API_TOKEN_SALT=<generate-new-random-key>
ADMIN_JWT_SECRET=<generate-new-random-key>
TRANSFER_TOKEN_SALT=<generate-new-random-key>
JWT_SECRET=<generate-new-random-key>
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}
DATABASE_PORT=5432
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=false
```

### 2.4 Add PostgreSQL Database
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically link it
3. The `${{Postgres.*}}` variables will auto-populate

### 2.5 Generate Production Keys
Run this locally to generate secure keys:

```bash
node -e "const crypto = require('crypto'); console.log('APP_KEYS=' + crypto.randomBytes(32).toString('base64') + ',' + crypto.randomBytes(32).toString('base64')); console.log('API_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64')); console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(32).toString('base64')); console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64')); console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));"
```

Copy these values into Railway environment variables.

### 2.6 Configure Build
1. Go to "Settings" tab
2. Set "Root Directory": `/cms`
3. Set "Dockerfile Path": `/cms/Dockerfile`
4. Click "Deploy"

### 2.7 Get Your CMS URL
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://your-cms.up.railway.app`)
4. **Save this URL** - you'll need it for Netlify

### 2.8 Configure Strapi for Production
1. Once deployed, visit `https://your-cms.up.railway.app/admin`
2. Create your admin account
3. Go to Settings → API Tokens
4. Create a new API token with "Full access"
5. **Save this token** - you'll need it for Netlify

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Sign up for Netlify
1. Go to https://netlify.com
2. Sign up with GitHub

### 3.2 Create New Site
1. Click "Add new site" → "Import an existing project"
2. Select "GitHub"
3. Select your `helpables-jamstack` repository

### 3.3 Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`
- **Node version**: 20

### 3.4 Add Environment Variables
Click "Show advanced" → "New variable" and add:

```
NEXT_PUBLIC_STRAPI_URL=https://your-cms.up.railway.app
STRAPI_API_TOKEN=<your-api-token-from-step-2.8>
```

Replace `your-cms.up.railway.app` with your actual Railway CMS URL.

### 3.5 Deploy
1. Click "Deploy site"
2. Wait 2-3 minutes for build to complete
3. Your site will be live at `https://random-name.netlify.app`

### 3.6 Custom Domain (Optional)
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

---

## Step 4: Configure Strapi API Permissions

1. Go to your CMS admin: `https://your-cms.up.railway.app/admin`
2. Go to Settings → Users & Permissions → Roles → Public
3. Enable these permissions:
   - **Blog**: `find`, `findOne`
   - **Service**: `find`, `findOne`
   - **Testimonial**: `find`, `findOne`
   - **Homepage**: `find`
   - **FAQ**: `find`, `findOne`
4. Click "Save"

---

## Step 5: Test Your Site

1. Visit your Netlify URL
2. The homepage should load
3. Add some content in Strapi admin
4. Refresh your Netlify site - content should appear!

---

## 🎉 You're Live!

Your JAMstack site is now deployed:
- **Frontend**: https://your-site.netlify.app
- **CMS Admin**: https://your-cms.up.railway.app/admin

### Automatic Deployments
- Push to GitHub → Netlify auto-deploys frontend
- Changes in Strapi → Frontend fetches new content on next build
- Trigger manual Netlify deploy: Site settings → "Trigger deploy"

---

## 💰 Costs

- **Netlify**: Free (100GB bandwidth/month)
- **Railway**: ~$5-10/month
  - PostgreSQL: ~$5/month
  - Container Apps: ~$5/month
  - First $5/month is FREE credit

---

## 🔧 Troubleshooting

### Frontend not fetching data
- Check `NEXT_PUBLIC_STRAPI_URL` in Netlify env vars
- Check API permissions in Strapi (Step 4)
- Check Strapi API token is valid

### CMS not starting on Railway
- Check environment variables are set
- Check PostgreSQL is connected
- View logs in Railway dashboard

### Build failing on Netlify
- Check Node version is set to 20
- Check base directory is `frontend`
- View build logs for specific errors

---

## 📚 Next Steps

1. **Set up CI/CD**: GitHub Actions already configured
2. **Add custom domain**: Both Netlify and Railway support this
3. **Enable HTTPS**: Automatic on both platforms
4. **Set up monitoring**: Use Railway metrics and Netlify analytics
5. **Configure CDN**: Netlify provides global CDN automatically

---

Need help? Check the logs:
- **Netlify**: Site dashboard → Deploys → View build logs
- **Railway**: Project → Service → Logs tab
