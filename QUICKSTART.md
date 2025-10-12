# Quick Start Guide

Get your Helpables Jamstack site running in minutes!

## 🚀 Installation

### 1. Install Dependencies

```bash
# Install root dependencies (optional, for convenience scripts)
npm install

# Or install each separately:

# Frontend
cd frontend
npm install

# CMS
cd ../cms
npm install
```

### 2. Set Up Environment Variables

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
REVALIDATION_SECRET=my-secret-key-123
```

**CMS:**
```bash
cd cms
cp .env.example .env
```

The default settings in `.env.example` work for local development.

### 3. Start Development Servers

**Option A: Start both servers with one command (requires concurrently)**
```bash
npm run dev
```

**Option B: Start servers separately**

Terminal 1 - CMS:
```bash
cd cms
npm run develop
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 4. Set Up Strapi Admin

1. Open http://localhost:1337/admin
2. Create your admin account
3. You'll be redirected to the admin dashboard

### 5. Add Content

#### Manual Entry
1. Go to Content Manager in Strapi admin
2. Add entries for:
   - Services
   - Testimonials
   - Blog posts
   - FAQs
   - Homepage settings

#### View Seed Data
```bash
cd cms
npm run seed
```

This shows the structure and example data you can add.

### 6. Configure Permissions

1. Go to Settings → Users & Permissions → Roles → Public
2. Enable "find" and "findOne" for all content types:
   - blog
   - service
   - testimonial
   - faq
   - homepage
3. Save

### 7. View Your Site

Open http://localhost:3000 in your browser!

## 📝 Next Steps

### Add Your First Blog Post

1. In Strapi admin, go to Content Manager → Blog
2. Click "Create new entry"
3. Fill in:
   - Title: "Welcome to Helpables"
   - Slug: Auto-generated from title
   - Excerpt: "Getting started with our services"
   - Body: Write your content
   - Cover Image: Upload an image (optional)
4. Click "Publish"
5. Visit http://localhost:3000/blog to see it

### Customize Branding

1. Replace logo: `frontend/public/logo.svg`
2. Update colors in: `frontend/tailwind.config.ts`
3. Update metadata in: `frontend/app/layout.tsx`

### Add Services

1. In Strapi admin, go to Content Manager → Service
2. Create services with:
   - Title: Service name
   - Description: What you offer
   - Icon: An emoji (🤖, ⚡, 🔄, etc.)
   - Order: Display order (1, 2, 3...)
3. Publish

## 🔧 Common Tasks

### Build for Production

```bash
# Frontend
cd frontend
npm run build
npm run start

# CMS
cd cms
npm run build
NODE_ENV=production npm run start
```

### Type Check

```bash
cd frontend
npm run type-check
```

### Lint Code

```bash
cd frontend
npm run lint
```

## 🐛 Troubleshooting

### CMS won't start
- Check that port 1337 is not in use
- Delete `.tmp` folder and restart
- Check Node.js version (requires 18+)

### Frontend can't fetch data
- Ensure CMS is running
- Check NEXT_PUBLIC_STRAPI_URL in `.env.local`
- Verify permissions are set for public access in Strapi

### Build errors
- Run `npm ci` to clean install dependencies
- Clear Next.js cache: `rm -rf .next`
- Check TypeScript errors: `npm run type-check`

## 📚 Learn More

- [Full README](README.md)
- [Vercel Deployment](VERCEL.md)
- [Azure Deployment](AZURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)

## 🆘 Need Help?

Contact: hello@helpables.io

---

Happy building! 🎉
