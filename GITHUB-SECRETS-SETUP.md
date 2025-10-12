# GitHub Actions Secrets Setup Guide

This guide explains how to set up the GitHub Secrets needed for automatic deployments.

## 🔐 Required Secrets

### For Netlify Deployment (Frontend)

1. **NETLIFY_AUTH_TOKEN**
   - Go to Netlify: https://app.netlify.com/user/applications
   - Click "New access token"
   - Give it a name: "GitHub Actions Deploy"
   - Copy the token
   - Add to GitHub: Repository → Settings → Secrets → New secret
   - Name: `NETLIFY_AUTH_TOKEN`

2. **NETLIFY_SITE_ID**
   - Go to your Netlify site dashboard
   - Go to Site settings → General → Site details
   - Copy the "API ID"
   - Add to GitHub as secret: `NETLIFY_SITE_ID`

3. **NEXT_PUBLIC_STRAPI_URL**
   - This is your CMS URL (e.g., `https://your-cms.up.railway.app`)
   - Add to GitHub as secret: `NEXT_PUBLIC_STRAPI_URL`

---

### For CMS Deployment

Choose ONE of these options based on where you want to host your CMS:

#### Option A: Railway

4. **RAILWAY_TOKEN**
   - Go to Railway: https://railway.app/account/tokens
   - Click "Create Token"
   - Give it a name: "GitHub Actions"
   - Copy the token
   - Add to GitHub as secret: `RAILWAY_TOKEN`

#### Option B: Render

4. **RENDER_DEPLOY_HOOK**
   - Go to your Render dashboard
   - Select your Strapi service
   - Go to Settings → Deploy Hook
   - Create a new deploy hook
   - Copy the URL
   - Add to GitHub as secret: `RENDER_DEPLOY_HOOK`

#### Option C: Azure

4. **AZURE_CREDENTIALS**
   - Run: `az ad sp create-for-rbac --name "github-actions" --role contributor --scopes /subscriptions/{subscription-id} --sdk-auth`
   - Copy the entire JSON output
   - Add to GitHub as secret: `AZURE_CREDENTIALS`

5. **AZURE_REGISTRY_NAME**
   - Your Azure Container Registry name
   - Add to GitHub as secret: `AZURE_REGISTRY_NAME`

6. **AZURE_CONTAINERAPP_NAME**
   - Your Container App name
   - Add to GitHub as secret: `AZURE_CONTAINERAPP_NAME`

7. **AZURE_RESOURCE_GROUP**
   - Your Resource Group name
   - Add to GitHub as secret: `AZURE_RESOURCE_GROUP`

---

## 📝 How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Enter the name and value
6. Click **Add secret**

Repeat for each secret you need!

---

## ✅ Testing Your Setup

After adding secrets:

1. Make any change to your code
2. Commit and push to `main` branch
3. Go to GitHub → Actions tab
4. Watch the workflow run
5. Check the logs if anything fails

---

## 🚀 Workflow Triggers

- **Push to `main`**: Deploys to production (Netlify + CMS)
- **Pull Request**: Creates preview deployment on Netlify only
- **Manual**: Can trigger from Actions tab

---

## 🔧 Troubleshooting

**"Secret not found"**: Make sure you spelled the secret name exactly as shown above (case-sensitive!)

**"Authentication failed"**: Double-check the token/credentials are valid and not expired

**"Permission denied"**: For Azure, make sure the service principal has correct permissions

---

## 📚 Next Steps

After setting up secrets:
1. Push a commit to trigger the workflow
2. Check GitHub Actions tab for deployment status
3. Visit your Netlify site to see the changes!
