# Helpables LLC - Jamstack Website# Helpables Jamstack Starter 🚀



> Modern, fast, and scalable business website built with Next.js, Strapi CMS, and deployed on Netlify & Railway.A complete, production-ready Jamstack starter for **Helpables LLC** featuring Next.js 14, Strapi v5 CMS, and deployment-ready configurations for Vercel and Azure.



## 📋 Table of Contents![Helpables Logo](frontend/public/logo.svg)



- [Overview](#overview)## 🌟 Features

- [Technology Stack](#technology-stack)

- [Architecture](#architecture)- **Modern Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS

- [Features](#features)- **Headless CMS**: Strapi v5 with pre-configured content types

- [Project Structure](#project-structure)- **SEO Optimized**: Built-in SEO best practices with Next SEO

- [Deployment](#deployment)- **Responsive Design**: Mobile-first design with Tailwind CSS

- [Third-Party Services](#third-party-services)- **Animations**: Smooth animations with Framer Motion

- [Environment Variables](#environment-variables)- **Type-Safe**: Full TypeScript support across the stack

- [Development Setup](#development-setup)- **CI/CD Ready**: GitHub Actions workflows for automated deployment

- [Content Management](#content-management)- **ISR Support**: Incremental Static Regeneration for optimal performance

- [Troubleshooting](#troubleshooting)

## 📁 Project Structure

---

```

## 🎯 Overviewhelpables-jamstack/

├── frontend/                 # Next.js application

Helpables LLC is a modern Jamstack website featuring:│   ├── app/                 # App Router pages and layouts

- **Headless CMS** (Strapi) for easy content management│   │   ├── page.tsx         # Home page

- **Next.js 14** frontend with App Router│   │   ├── services/        # Services page

- **Dark/Light mode** theme support (default: dark)│   │   ├── blog/            # Blog pages

- **Free consultation booking** via Calendly integration│   │   └── api/             # API routes

- **Email notifications** via Resend API│   ├── components/          # React components

- **Markdown support** with GitHub Flavored Markdown│   │   ├── Navbar.tsx

- **SEO-ready** with metadata and robots.txt│   │   ├── Hero.tsx

│   │   ├── Footer.tsx

---│   │   └── CMSRenderer.tsx

│   ├── lib/                 # Utilities and helpers

## 🛠 Technology Stack│   │   └── cms.ts           # CMS API helpers

│   ├── public/              # Static assets

### Frontend│   └── styles/              # Global styles

- **Framework:** Next.js 14.2.3 (App Router)│

- **Language:** TypeScript├── cms/                     # Strapi CMS

- **Styling:** Tailwind CSS 3.4.1│   ├── config/              # Strapi configuration

- **UI Components:** │   ├── src/api/             # API endpoints and content types

  - Framer Motion (animations)│   │   ├── blog/

  - React Markdown (content rendering)│   │   ├── service/

  - @tailwindcss/typography (prose styling)│   │   ├── testimonial/

- **Theme:** Custom dark/light mode with localStorage persistence│   │   ├── faq/

│   │   └── homepage/

### Backend (CMS)│   └── scripts/             # Utility scripts

- **CMS:** Strapi v4.25.9│       └── seed.js          # Demo data seeder

- **Database:** PostgreSQL (Railway managed)│

- **Storage:** Railway ephemeral storage└── .github/

- **API:** REST API with auto-generated endpoints    └── workflows/           # CI/CD pipelines

        ├── deploy.yml       # Production deployment

### Deployment        └── ci.yml           # Continuous integration

- **Frontend:** Netlify (https://aesthetic-paprenjak-090ff8.netlify.app)```

- **Backend:** Railway (https://helpablesllc-production.up.railway.app)

- **CI/CD:** Automatic deployment via GitHub integration## 🚀 Quick Start



### Third-Party Services### Prerequisites

- **Calendly:** Free consultation booking

- **Resend:** Email delivery service- Node.js 18+ and npm

- **GitHub:** Version control and CI/CD- Git



---### Installation



## 🏗 Architecture1. **Clone the repository**



``````bash

┌─────────────────────────────────────────────────────────────┐git clone <your-repo-url> helpables-jamstack

│                         Users                                │cd helpables-jamstack

└───────────────────────┬─────────────────────────────────────┘```

                        │

                        ▼2. **Install Frontend Dependencies**

┌─────────────────────────────────────────────────────────────┐

│                    Netlify CDN                               │```bash

│                  (Next.js Frontend)                          │cd frontend

│  ┌──────────────────────────────────────────────────────┐   │npm install

│  │  Pages:                                              │   │```

│  │  • Home (/)                                          │   │

│  │  • Services (/services, /services/[slug])           │   │3. **Install CMS Dependencies**

│  │  • Blog (/blog, /blog/[slug])                       │   │

│  │  • Contact (/contact) - with Calendly embed          │   │```bash

│  │  • Privacy Policy (/privacy)                         │   │cd ../cms

│  └──────────────────────────────────────────────────────┘   │npm install

└───────────────────────┬─────────────────────────────────────┘```

                        │

                        │ API Calls (REST)4. **Configure Environment Variables**

                        ▼

┌─────────────────────────────────────────────────────────────┐**Frontend** (`frontend/.env.local`):

│                    Railway Platform                          │```bash

│                   (Strapi CMS + PostgreSQL)                  │cp frontend/.env.example frontend/.env.local

│  ┌──────────────────────────────────────────────────────┐   │```

│  │  Content Types:                                      │   │

│  │  • Homepage (single)                                 │   │Edit `frontend/.env.local`:

│  │  • Services (collection)                             │   │```env

│  │  • Blog (collection)                                 │   │NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

│  │  • Testimonials (collection)                         │   │REVALIDATION_SECRET=your-secret-key

│  │  • FAQs (collection)                                 │   │```

│  │  • Privacy Policy (single)                           │   │

│  │  • Contact Submissions (collection)                  │   │**CMS** (`cms/.env`):

│  └──────────────────────────────────────────────────────┘   │```bash

└───────────────────────┬─────────────────────────────────────┘cp cms/.env.example cms/.env

                        │```

                        │ Email on Contact Submit

                        ▼Edit `cms/.env` and update the secrets for production.

┌─────────────────────────────────────────────────────────────┐

│                    Resend API                                │### 🏃 Running Locally

│          (Email Delivery to support@helpables.org)           │

└─────────────────────────────────────────────────────────────┘#### Start the CMS (Strapi)



                External Integrations:```bash

                cd cms

┌──────────────────────┐        ┌──────────────────────┐npm run develop

│    Calendly API      │        │     GitHub Repo      │```

│  (Booking Calendar)  │        │   (Version Control)  │

└──────────────────────┘        └──────────────────────┘- Admin panel: http://localhost:1337/admin

```- Create your admin user on first launch

- API available at: http://localhost:1337/api

---

#### Start the Frontend (Next.js)

## ✨ Features

In a new terminal:

### Content Management

- **Dynamic Pages:** All content managed via Strapi CMS```bash

- **Markdown Support:** Rich text with GitHub Flavored Markdowncd frontend

- **Media Upload:** Images and videos via Strapinpm run dev

- **Order Management:** Custom ordering for services```

- **Draft/Publish:** Content workflow with publish states

- Website: http://localhost:3000

### User Experience

- **Dark/Light Mode:** Toggle with localStorage persistence (default: dark)### 📝 Seeding Demo Data

- **Responsive Design:** Mobile-first, works on all devices

- **Fast Loading:** Static generation + ISR for optimal performance1. Start your Strapi server

- **SEO Optimized:** Metadata, Open Graph, robots.txt2. Create an admin user

- **Accessibility:** Semantic HTML, ARIA labels3. Run the seed script to see demo data structure:



### Business Features```bash

- **Service Showcase:** Dynamic service pages with detailed descriptionscd cms

- **Blog System:** News and updates with markdown contentnpm run seed

- **Contact Form:** Email notifications via Resend```

- **Free Consultation Booking:** Calendly integration

- **Testimonials:** Client reviews and ratings4. Manually add content through the Strapi admin panel at http://localhost:1337/admin

- **FAQs:** Frequently asked questions

## 🎨 Brand Identity

---

**Helpables LLC** brand colors:

## 📁 Project Structure

- **Primary Green**: `#2ECC71`

```- **Secondary Blue**: `#00B8D9`

helpablesllc/- **Dark**: `#1A1A1A`

├── frontend/                    # Next.js Frontend- **Light**: `#F8F9FA`

│   ├── app/                     # App Router pages

│   │   ├── page.tsx            # Home pageFonts:

│   │   ├── layout.tsx          # Root layout- **Headings**: Poppins

│   │   ├── services/           # Services pages- **Body**: Inter

│   │   │   ├── page.tsx        # Services list

│   │   │   └── [slug]/page.tsx # Service detail## 📦 Content Types

│   │   ├── blog/               # Blog pages

│   │   │   ├── page.tsx        # Blog list### Blog

│   │   │   └── [slug]/page.tsx # Blog post- Title, Slug, Excerpt, Body (rich text), Cover Image

│   │   ├── contact/page.tsx    # Contact + Booking

│   │   └── privacy/page.tsx    # Privacy policy### Service

│   ├── components/             # Reusable components- Title, Description, Icon (emoji), Order

│   │   ├── Navbar.tsx          # Navigation

│   │   ├── Footer.tsx          # Footer### Testimonial

│   │   ├── Hero.tsx            # Hero section- Author, Company, Quote, Rating, Order

│   │   ├── CMSRenderer.tsx     # Markdown renderer

│   │   ├── ThemeToggle.tsx     # Theme switcher### FAQ

│   │   ├── CalendlyWidget.tsx  # Calendly embed- Question, Answer, Category, Order

│   │   └── ClientLayout.tsx    # Client wrapper

│   ├── contexts/### Homepage (Single Type)

│   │   └── ThemeContext.tsx    # Theme state management- Hero Title, Hero Subtitle, Hero Image

│   ├── lib/

│   │   └── strapi.ts           # Strapi API client## 🌐 Deployment

│   ├── public/                 # Static assets

│   └── tailwind.config.ts      # Tailwind configuration### Frontend (Vercel)

│

├── cms/                        # Strapi CMS1. **Install Vercel CLI**

│   ├── config/                 # Configuration

│   │   ├── database.js         # PostgreSQL config```bash

│   │   ├── server.js           # Server confignpm install -g vercel

│   │   └── plugins.js          # Email plugin```

│   ├── src/

│   │   ├── api/                # Content types2. **Login to Vercel**

│   │   │   ├── homepage/

│   │   │   ├── service/```bash

│   │   │   ├── blog/vercel login

│   │   │   ├── testimonial/```

│   │   │   ├── faq/

│   │   │   ├── privacy/3. **Deploy**

│   │   │   └── contact-submission/

│   │   ├── bootstrap.js        # Lifecycle hooks```bash

│   │   └── seed.ts             # Sample data seedercd frontend

│   └── package.jsonvercel --prod

│```

└── README.md                   # This file

```4. **Set Environment Variables** in Vercel dashboard:

   - `NEXT_PUBLIC_STRAPI_URL`: Your Strapi production URL

---   - `REVALIDATION_SECRET`: Secret for on-demand revalidation



## 🚀 Deployment### CMS (Azure App Service)



### Frontend (Netlify)1. **Create an Azure App Service** for Node.js

2. **Configure deployment** from GitHub or use Azure CLI

**URL:** https://aesthetic-paprenjak-090ff8.netlify.app3. **Set environment variables** in Azure portal

4. **Deploy** using GitHub Actions or Azure DevOps

**Configuration:**

- **Build Command:** `cd frontend && npm run build`Example using Azure CLI:

- **Publish Directory:** `frontend/.next`

- **Node Version:** 18.x```bash

- **Environment Variables:**az webapp up --name helpables-cms --runtime "NODE:20LTS"

  - `NEXT_PUBLIC_STRAPI_URL=https://helpablesllc-production.up.railway.app````



**Deployment Process:**### CMS (Alternative: Render)

1. Push to `main` branch on GitHub

2. Netlify automatically detects changes1. Create a new Web Service on Render

3. Builds and deploys in ~2-3 minutes2. Connect your repository

4. CDN distributes globally3. Set build command: `npm install && npm run build`

4. Set start command: `npm run start`

### Backend (Railway)5. Add environment variables



**URL:** https://helpablesllc-production.up.railway.app## 🔄 CI/CD



**Services:**GitHub Actions workflows are included:

- **Strapi CMS:** Port 1337

- **PostgreSQL Database:** Managed by Railway- **`ci.yml`**: Runs on pull requests - linting, type checking, and build tests

- **`deploy.yml`**: Deploys to production on push to main branch

**Configuration:**

- **Build Command:** `cd cms && npm install && npm run build`### Required GitHub Secrets

- **Start Command:** `cd cms && npm run start`

- **Environment Variables:**- `VERCEL_TOKEN`: Vercel authentication token

  - `DATABASE_URL` (auto-set by Railway)- `VERCEL_ORG_ID`: Your Vercel organization ID

  - `NODE_ENV=production`- `VERCEL_PROJECT_ID`: Your Vercel project ID

  - `APP_KEYS` (Strapi encryption keys)- `NEXT_PUBLIC_STRAPI_URL`: Production Strapi URL

  - `API_TOKEN_SALT`- (Optional) `AZURE_PUBLISH_PROFILE`: For Azure deployment

  - `ADMIN_JWT_SECRET`

  - `TRANSFER_TOKEN_SALT`## 🛠️ Development

  - `JWT_SECRET`

  - `RESEND_API_KEY`### Frontend Scripts

  - `RESEND_DEFAULT_FROM`

  - `RESEND_DEFAULT_TO````bash

npm run dev          # Start development server

**Deployment Process:**npm run build        # Build for production

1. Push to `main` branch on GitHubnpm run start        # Start production server

2. Railway automatically builds and deploysnpm run lint         # Run ESLint

3. Database migrations run automaticallynpm run type-check   # Run TypeScript compiler

4. Service restarts with zero downtime```



---### CMS Scripts



## 🔌 Third-Party Services```bash

npm run develop      # Start Strapi in development mode

### 1. Calendly (Free Consultation Booking)npm run start        # Start Strapi in production mode

npm run build        # Build Strapi admin panel

**Purpose:** Allow visitors to book 30-minute consultationsnpm run seed         # Display seed data structure

```

**Integration:**

- Embedded in `/contact` page via CalendlyWidget component## 🔐 API Configuration

- URL: `https://calendly.com/cliqueadmin-helpables/30min`

- Features: Calendar selection, timezone detection, email confirmationThe CMS API is configured to allow public read access. To customize permissions:



**Configuration:**1. Go to **Settings** > **Users & Permissions** > **Roles** > **Public**

```tsx2. Enable/disable permissions for each content type

// frontend/components/CalendlyWidget.tsx3. For webhook revalidation, create an API token in Strapi

<CalendlyWidget url="https://calendly.com/cliqueadmin-helpables/30min" />

```## 📊 Analytics



### 2. Resend (Email Service)To add Google Analytics:



**Purpose:** Send email notifications when contact form is submitted1. Get your GA4 measurement ID

2. Add to `frontend/.env.local`:

**Configuration:**```env

- **API Key:** Set in Railway environment variablesNEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

- **From Email:** `onboarding@resend.dev````

- **To Email:** `support@helpables.org`

3. Add Google Analytics script to `frontend/app/layout.tsx`

**Email Template:**

```## 🚧 Future Enhancements

Subject: New Contact Form Submission

- [ ] AI chatbot integration

Name: [User's name]- [ ] Payment processing (Stripe)

Email: [User's email]- [ ] Email automation

Phone: [User's phone]- [ ] Advanced analytics dashboard

Subject: [Message subject]- [ ] Multi-language support (i18n)

- [ ] Dark mode toggle

Message:- [ ] Advanced search functionality

[User's message]- [ ] User authentication

```- [ ] Comment system for blog posts

- [ ] Newsletter subscription

**Strapi Plugin Configuration:**

```javascript## 📚 Tech Stack

// cms/config/plugins.js

module.exports = {### Frontend

  email: {- [Next.js 14](https://nextjs.org/) - React framework

    config: {- [TypeScript](https://www.typescriptlang.org/) - Type safety

      provider: 'resend',- [Tailwind CSS](https://tailwindcss.com/) - Styling

      providerOptions: {- [Framer Motion](https://www.framer.com/motion/) - Animations

        apiKey: env('RESEND_API_KEY'),- [Next SEO](https://github.com/garmeeh/next-seo) - SEO optimization

      },

      settings: {### CMS

        defaultFrom: env('RESEND_DEFAULT_FROM'),- [Strapi v5](https://strapi.io/) - Headless CMS

        defaultReplyTo: env('RESEND_DEFAULT_TO'),- [SQLite](https://www.sqlite.org/) - Database (development)

      },- [PostgreSQL](https://www.postgresql.org/) - Database (production recommended)

    },

  },### DevOps

};- [Vercel](https://vercel.com/) - Frontend hosting

```- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) - CMS hosting

- [GitHub Actions](https://github.com/features/actions) - CI/CD

### 3. GitHub

## 🤝 Contributing

**Purpose:** Version control and CI/CD triggers

This is a proprietary starter template for Helpables LLC. For internal development:

**Repository:** `cliqueadmin-h/helpablesllc`

1. Create a feature branch

**Branch Strategy:**2. Make your changes

- `main` - Production branch (auto-deploys to Netlify & Railway)3. Submit a pull request

4. Ensure CI passes

---

## 📄 License

## 🔐 Environment Variables

Copyright © 2025 Helpables LLC. All rights reserved.

### Frontend (.env.local)

## 💬 Support

```bash

NEXT_PUBLIC_STRAPI_URL=https://helpablesllc-production.up.railway.appFor questions or support, contact: hello@helpables.io

```

---

### Backend (Railway)

**Built with ❤️ by Helpables LLC**

```bash
# Database (auto-set by Railway)
DATABASE_URL=postgresql://...

# Strapi Secrets (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random_string
ADMIN_JWT_SECRET=random_string
TRANSFER_TOKEN_SALT=random_string
JWT_SECRET=random_string

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_DEFAULT_FROM=onboarding@resend.dev
RESEND_DEFAULT_TO=support@helpables.org

# Node Environment
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

---

## 💻 Development Setup

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL (or use Railway for development)
- Git

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/cliqueadmin-h/helpablesllc.git
cd helpablesllc
```

2. **Setup Backend (Strapi)**
```bash
cd cms
npm install
cp .env.example .env  # Configure database and secrets
npm run develop       # Starts on http://localhost:1337
```

3. **Setup Frontend (Next.js)**
```bash
cd frontend
npm install
cp .env.example .env.local  # Add NEXT_PUBLIC_STRAPI_URL
npm run dev                  # Starts on http://localhost:3000
```

4. **Create Admin User**
- Visit http://localhost:1337/admin
- Create first admin user
- Enable public permissions for content types

5. **Seed Sample Data** (Optional)
```bash
cd cms
npm run strapi seed
```

---

## 📝 Content Management

### Accessing Strapi Admin

**Production:** https://helpablesllc-production.up.railway.app/admin

**Credentials:** Provided securely (not in repository)

### Content Types Overview

| Content Type | Type | Purpose | Fields |
|-------------|------|---------|--------|
| Homepage | Single | Hero section content | title, subtitle, image, video, CTA |
| Services | Collection | Service offerings | title, description, icon, order, content |
| Blog | Collection | News and articles | title, slug, excerpt, content, author, image |
| Testimonials | Collection | Client reviews | author, company, quote, rating, order |
| FAQs | Collection | Common questions | question, answer, order |
| Privacy | Single | Privacy policy | title, content, lastUpdated |
| Contact Submissions | Collection | Form submissions | name, email, phone, subject, message, status |

### Adding New Content

1. Log in to Strapi admin
2. Navigate to **Content Manager**
3. Select content type
4. Click **Create new entry**
5. Fill in fields (use Markdown for rich text)
6. Click **Save** then **Publish**

### Public Permissions

Ensure these are enabled in **Settings > Users & Permissions > Public**:
- ✅ Homepage: find
- ✅ Services: find, findOne
- ✅ Blog: find, findOne
- ✅ Testimonials: find
- ✅ FAQs: find
- ✅ Privacy: find
- ✅ Contact Submissions: create

---

## 🐛 Troubleshooting

### Common Issues

**1. Contact form not working**
- Check Resend API key is set in Railway
- Verify email plugin is configured in `cms/config/plugins.js`
- Ensure public permissions are enabled for contact-submissions

**2. Images not loading**
- Railway uses ephemeral storage (images lost on redeploy)
- Solution: Use Cloudinary or S3 for persistent media storage

**3. Privacy page shows 404**
- Ensure privacy content is published in Strapi
- Verify public "find" permission is enabled for privacy

**4. Dark mode not persisting**
- Clear browser localStorage
- Check ThemeContext is properly wrapped in layout

**5. Calendly not loading**
- Check network tab for blocked scripts
- Verify Calendly URL is correct in CalendlyWidget component

### Getting Help

- **Email:** support@helpables.org
- **Issues:** GitHub repository issues tab

---

## 📄 License

Copyright © 2025 Helpables LLC. All rights reserved.

---

## 🎉 Deployment Checklist

Before going live:

- [ ] Update SEO settings in frontend/app/layout.tsx (remove noindex)
- [ ] Set up custom domain on Netlify
- [ ] Configure Cloudinary/S3 for persistent media
- [ ] Update Calendly URL with business account
- [ ] Configure custom email domain in Resend
- [ ] Set up monitoring and analytics
- [ ] Add SSL certificate (auto by Netlify)
- [ ] Test all forms and integrations
- [ ] Backup database regularly
- [ ] Document admin credentials securely

---

**Built with ❤️ by Helpables LLC**
