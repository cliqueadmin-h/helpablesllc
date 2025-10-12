# 🚀 Quick Start Guide - Helpables Jamstack Starter

## Choose Your Path

### Path A: Docker (Recommended)
**Best for:** Quick start, any Node version, consistent environment
**Time:** 5 minutes

### Path B: Direct Install
**Best for:** Users with Node.js 18-20 already installed
**Time:** 10 minutes

---

## Path A: Docker Setup (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Step 1: Start All Services

```powershell
# Start everything with one command!
docker-compose -f docker-compose.dev.yml up --build
```

That's it! Docker will:
- ✅ Build both CMS and frontend
- ✅ Install all dependencies
- ✅ Start both servers
- ✅ Handle all configurations

### Step 2: Access Applications

- **CMS Admin**: http://localhost:1337/admin
- **Frontend Website**: http://localhost:3000

### Step 3: Create Admin Account

1. Open http://localhost:1337/admin
2. Fill in the registration form:
   - **First Name**: Your name
   - **Last Name**: Your last name
   - **Email**: admin@helpables.io
   - **Password**: Create a strong password
3. Click **Let's Start**

### Step 4: Configure API Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Expand each content type and enable:
   - **Blog**: `find`, `findOne`
   - **Service**: `find`, `findOne`
   - **Testimonial**: `find`, `findOne`
   - **FAQ**: `find`, `findOne`
   - **Homepage**: `find`
3. Click **Save** at the top right

### Step 5: Add Sample Content

#### Create Homepage Content
1. Go to **Content Manager** → **Homepage** (Single Type)
2. Fill in:
   - **Hero Title**: "Welcome to Helpables"
   - **Hero Subtitle**: "Your partner in digital transformation"
   - **Hero CTA Text**: "Get Started"
   - **Hero CTA Link**: "/services"
3. Click **Save** and **Publish**

#### Create Services
1. Go to **Content Manager** → **Service**
2. Click **Create new entry**
3. Fill in:
   - **Title**: "Web Development"
   - **Description**: "Custom websites and web applications"
   - **Icon**: "code"
   - **Order**: 1
4. **Save** and **Publish**
5. Repeat for more services (AI Integration, Automation, etc.)

#### Create Blog Posts
1. Go to **Content Manager** → **Blog**
2. Click **Create new entry**
3. Fill in:
   - **Title**: "Welcome to Helpables Blog"
   - **Slug**: "welcome-to-helpables-blog"
   - **Excerpt**: "Learn about our journey and services"
   - **Body**: Write your content in Markdown
   - **Published At**: Today's date
4. Upload a **Cover Image**
5. **Save** and **Publish**

### Step 6: View Your Website

Visit http://localhost:3000 to see your content!

### Docker Commands

```powershell
# Start services
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Restart after changes
docker-compose -f docker-compose.dev.yml restart

# Clean restart (removes data!)
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

---

## Path B: Direct Install

### Prerequisites
- Node.js 18 or 20 (check with `node --version`)
- npm or yarn

### Option B1: If you have Node 24+

Install Node Version Manager (NVM):

```powershell
# Install NVM for Windows
# Download from: https://github.com/coreybutler/nvm-windows/releases

# After installing NVM:
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

### Option B2: Direct Install (Node 18-20)

#### Step 1: Install Dependencies

```powershell
# Install CMS dependencies
cd cms
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Step 2: Configure Environment

```powershell
# CMS environment
cd cms
Copy-Item .env.example .env

# Generate secrets
node -e "const crypto = require('crypto'); console.log('APP_KEYS=' + crypto.randomBytes(16).toString('base64') + ',' + crypto.randomBytes(16).toString('base64')); console.log('API_TOKEN_SALT=' + crypto.randomBytes(16).toString('base64')); console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(16).toString('base64')); console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(16).toString('base64')); console.log('JWT_SECRET=' + crypto.randomBytes(16).toString('base64'));"

# Copy the output and update .env file manually

# Frontend environment
cd ../frontend
Copy-Item .env.example .env.local
```

#### Step 3: Start Services

```powershell
# Terminal 1: Start CMS
cd cms
npm run develop

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

#### Step 4: Follow Steps 2-6 from Docker Path

Same as Docker setup above.

---

## Testing the API

### Test CMS API Directly

```powershell
# Get all services
curl http://localhost:1337/api/services

# Get all blog posts
curl http://localhost:1337/api/blogs

# Get homepage
curl http://localhost:1337/api/homepage
```

### Test Frontend Pages

- Homepage: http://localhost:3000
- Services: http://localhost:3000/services
- Blog: http://localhost:3000/blog
- Blog Post: http://localhost:3000/blog/[slug]

---

## Common Tasks

### Add a New Blog Post

1. Go to CMS: http://localhost:1337/admin
2. **Content Manager** → **Blog** → **Create new entry**
3. Fill in all fields
4. **Save** and **Publish**
5. View at: http://localhost:3000/blog

### Add a New Service

1. Go to CMS: http://localhost:1337/admin
2. **Content Manager** → **Service** → **Create new entry**
3. Fill in title, description, icon, order
4. **Save** and **Publish**
5. View at: http://localhost:3000/services

### Update Homepage

1. Go to CMS: http://localhost:1337/admin
2. **Content Manager** → **Homepage**
3. Edit fields
4. **Save** and **Publish**
5. View at: http://localhost:3000

---

## Troubleshooting

### CMS Won't Start

**Docker:**
```powershell
# Check logs
docker-compose -f docker-compose.dev.yml logs cms

# Restart
docker-compose -f docker-compose.dev.yml restart cms
```

**Direct Install:**
- Ensure Node version is 18-20
- Delete `node_modules` and `.tmp` folder
- Run `npm install` again

### Frontend Can't Connect to CMS

1. Check CMS is running at http://localhost:1337
2. Verify `.env.local` has `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api`
3. Restart frontend server

### Port Already in Use

```powershell
# Find what's using port 1337
netstat -ano | findstr :1337

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Permission Errors (Docker)

- Ensure Docker Desktop is running
- Run PowerShell as Administrator if needed

### Cannot Access CMS Admin

1. Clear browser cache
2. Try incognito/private mode
3. Check console for errors (F12)
4. Verify CMS is running

---

## Next Steps

### Local Development
- ✅ Add more content
- ✅ Customize components in `frontend/components/`
- ✅ Add new pages in `frontend/app/`
- ✅ Modify Strapi content types

### Deploy to Production
- 📚 Read: `AZURE-CMS-DEPLOYMENT.md` - Deploy CMS to Azure
- 📚 Read: `VERCEL.md` - Deploy Frontend to Vercel
- 📚 Read: `DEPLOYMENT-CHECKLIST.md` - Complete checklist

### Advanced Features
- Add authentication
- Implement commenting system
- Add newsletter signup
- Integrate analytics
- Add contact form
- Set up email notifications

---

## Resources

- **Documentation**: See all `.md` files in project root
- **Strapi Docs**: https://docs.strapi.io
- **Next.js Docs**: https://nextjs.org/docs
- **Docker Docs**: https://docs.docker.com

## Support

Need help? Contact hello@helpables.io

---

**Time to First Page**: ~5 minutes with Docker! 🚀
