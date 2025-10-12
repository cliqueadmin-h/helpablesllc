# 🚀 Quick Deployment Guide with GitHub Actions

## What is this?

**GitHub Actions** = Automatic deployment whenever you push code to GitHub  
**Railway** = Platform to host your Strapi CMS (alternative to Azure, simpler setup)  
**Netlify** = Hosts your Next.js frontend with global CDN

## ⚡ Quick Deploy (20 minutes)

### Step 1: Push to GitHub (2 minutes)

```bash
# Create repo on GitHub first: https://github.com/new
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/helpables-jamstack.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy CMS to Railway (8 minutes)

1. **Sign up**: https://railway.app (use GitHub login)
2. **Create project**: New Project → Deploy from GitHub Repo
3. **Select repo**: Choose `helpables-jamstack`
4. **Add PostgreSQL**: New → Database → PostgreSQL
5. **Set variables**: Click CMS service → Variables tab

   ```
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337
   DATABASE_CLIENT=postgres
   DATABASE_HOST=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}
   DATABASE_PORT=5432
   DATABASE_NAME=${{Postgres.PGDATABASE}}
   DATABASE_USERNAME=${{Postgres.PGUSER}}
   DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
   DATABASE_SSL=false
   ```

6. **Generate secrets** (run locally):
   ```bash
   node -e "const crypto = require('crypto'); console.log('APP_KEYS=' + crypto.randomBytes(32).toString('base64') + ',' + crypto.randomBytes(32).toString('base64')); console.log('API_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64')); console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(32).toString('base64')); console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64')); console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));"
   ```
   Copy output to Railway variables

7. **Get Railway token** (for GitHub Actions):
   - Account → Tokens → Create Token
   - Save for later!

8. **Deploy**: Railway auto-deploys from GitHub
9. **Get URL**: Settings → Networking → Generate Domain
10. **Create admin**: Visit URL/admin, create account

### Step 3: Deploy Frontend to Netlify (5 minutes)

1. **Sign up**: https://netlify.com (use GitHub login)
2. **New site**: Import from Git → GitHub → Select repo
3. **Build settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
4. **Environment variables**:
   - `NEXT_PUBLIC_STRAPI_URL` = Your Railway URL (from Step 2)
5. **Deploy**: Click "Deploy site"

### Step 4: Set up GitHub Secrets (5 minutes)

Go to GitHub → Your Repo → Settings → Secrets → Actions:

Add these secrets:

| Secret Name | Where to get it |
|-------------|-----------------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify → Site settings → Site details → API ID |
| `RAILWAY_TOKEN` | Railway → Account → Tokens (from Step 2.7) |
| `NEXT_PUBLIC_STRAPI_URL` | Your Railway CMS URL (from Step 2.9) |

**Detailed instructions**: See `GITHUB-SECRETS-SETUP.md`

### Step 5: Enable Strapi API Access (2 minutes)

1. Go to your CMS admin (Railway URL/admin)
2. Settings → Users & Permissions → Roles → Public
3. Enable for ALL content types:
   - ✅ `find`
   - ✅ `findOne`
4. **Save**

---

## ✅ You're Done!

### What you have now:

- ✅ CMS running on Railway (always on, PostgreSQL database)
- ✅ Frontend on Netlify (global CDN, auto SSL)
- ✅ **Automatic deployments** via GitHub Actions:
  - Push to `main` → Auto-deploys both CMS and frontend
  - Open Pull Request → Creates preview deployment
  - Merge PR → Deploys to production

### Test it:

```bash
# Make a change
echo "# Updated" >> README.md
git add .
git commit -m "Test GitHub Actions deployment"
git push

# Watch it deploy:
# GitHub → Actions tab → See deployment progress
```

---

## 🎯 How GitHub Actions Works

1. You push code to GitHub
2. GitHub Actions automatically:
   - Runs tests
   - Builds your frontend
   - Deploys to Netlify
   - Deploys CMS to Railway (if CMS code changed)
3. You get notified when done!

**No manual deployment needed!**

---

## 💰 Costs

- **GitHub Actions**: FREE (2000 minutes/month)
- **Railway**: ~$5-10/month (first $5 FREE credit)
- **Netlify**: FREE (100GB bandwidth)

**Total: ~$5-10/month** (or FREE if under Railway's limit)

---

## 📚 Files Created

- `.github/workflows/ci.yml` - Runs tests on PRs
- `.github/workflows/netlify-deploy.yml` - Automated deployment
- `GITHUB-SECRETS-SETUP.md` - Detailed secrets guide
- `NETLIFY-DEPLOYMENT.md` - Full Netlify guide

---

## 🆘 Need Help?

- **Deployment failing?** Check GitHub → Actions tab → View logs
- **CMS not working?** Check Railway → Logs
- **Frontend errors?** Check Netlify → Deploys → Build logs

**Common issues**: Missing secrets, wrong environment variables, API permissions not enabled

---

## 🔄 Daily Workflow

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# GitHub Actions automatically deploys!
# Check progress: GitHub → Actions tab
```

That's it! No manual deployment steps needed! 🎉
