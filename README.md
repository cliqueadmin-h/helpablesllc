# Helpables Jamstack Starter 🚀

A complete, production-ready Jamstack starter for **Helpables LLC** featuring Next.js 14, Strapi v5 CMS, and deployment-ready configurations for Vercel and Azure.

![Helpables Logo](frontend/public/logo.svg)

## 🌟 Features

- **Modern Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Headless CMS**: Strapi v5 with pre-configured content types
- **SEO Optimized**: Built-in SEO best practices with Next SEO
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth animations with Framer Motion
- **Type-Safe**: Full TypeScript support across the stack
- **CI/CD Ready**: GitHub Actions workflows for automated deployment
- **ISR Support**: Incremental Static Regeneration for optimal performance

## 📁 Project Structure

```
helpables-jamstack/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages and layouts
│   │   ├── page.tsx         # Home page
│   │   ├── services/        # Services page
│   │   ├── blog/            # Blog pages
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   └── CMSRenderer.tsx
│   ├── lib/                 # Utilities and helpers
│   │   └── cms.ts           # CMS API helpers
│   ├── public/              # Static assets
│   └── styles/              # Global styles
│
├── cms/                     # Strapi CMS
│   ├── config/              # Strapi configuration
│   ├── src/api/             # API endpoints and content types
│   │   ├── blog/
│   │   ├── service/
│   │   ├── testimonial/
│   │   ├── faq/
│   │   └── homepage/
│   └── scripts/             # Utility scripts
│       └── seed.js          # Demo data seeder
│
└── .github/
    └── workflows/           # CI/CD pipelines
        ├── deploy.yml       # Production deployment
        └── ci.yml           # Continuous integration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url> helpables-jamstack
cd helpables-jamstack
```

2. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

3. **Install CMS Dependencies**

```bash
cd ../cms
npm install
```

4. **Configure Environment Variables**

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
REVALIDATION_SECRET=your-secret-key
```

**CMS** (`cms/.env`):
```bash
cp cms/.env.example cms/.env
```

Edit `cms/.env` and update the secrets for production.

### 🏃 Running Locally

#### Start the CMS (Strapi)

```bash
cd cms
npm run develop
```

- Admin panel: http://localhost:1337/admin
- Create your admin user on first launch
- API available at: http://localhost:1337/api

#### Start the Frontend (Next.js)

In a new terminal:

```bash
cd frontend
npm run dev
```

- Website: http://localhost:3000

### 📝 Seeding Demo Data

1. Start your Strapi server
2. Create an admin user
3. Run the seed script to see demo data structure:

```bash
cd cms
npm run seed
```

4. Manually add content through the Strapi admin panel at http://localhost:1337/admin

## 🎨 Brand Identity

**Helpables LLC** brand colors:

- **Primary Green**: `#2ECC71`
- **Secondary Blue**: `#00B8D9`
- **Dark**: `#1A1A1A`
- **Light**: `#F8F9FA`

Fonts:
- **Headings**: Poppins
- **Body**: Inter

## 📦 Content Types

### Blog
- Title, Slug, Excerpt, Body (rich text), Cover Image

### Service
- Title, Description, Icon (emoji), Order

### Testimonial
- Author, Company, Quote, Rating, Order

### FAQ
- Question, Answer, Category, Order

### Homepage (Single Type)
- Hero Title, Hero Subtitle, Hero Image

## 🌐 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
cd frontend
vercel --prod
```

4. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_STRAPI_URL`: Your Strapi production URL
   - `REVALIDATION_SECRET`: Secret for on-demand revalidation

### CMS (Azure App Service)

1. **Create an Azure App Service** for Node.js
2. **Configure deployment** from GitHub or use Azure CLI
3. **Set environment variables** in Azure portal
4. **Deploy** using GitHub Actions or Azure DevOps

Example using Azure CLI:

```bash
az webapp up --name helpables-cms --runtime "NODE:20LTS"
```

### CMS (Alternative: Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start`
5. Add environment variables

## 🔄 CI/CD

GitHub Actions workflows are included:

- **`ci.yml`**: Runs on pull requests - linting, type checking, and build tests
- **`deploy.yml`**: Deploys to production on push to main branch

### Required GitHub Secrets

- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `NEXT_PUBLIC_STRAPI_URL`: Production Strapi URL
- (Optional) `AZURE_PUBLISH_PROFILE`: For Azure deployment

## 🛠️ Development

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### CMS Scripts

```bash
npm run develop      # Start Strapi in development mode
npm run start        # Start Strapi in production mode
npm run build        # Build Strapi admin panel
npm run seed         # Display seed data structure
```

## 🔐 API Configuration

The CMS API is configured to allow public read access. To customize permissions:

1. Go to **Settings** > **Users & Permissions** > **Roles** > **Public**
2. Enable/disable permissions for each content type
3. For webhook revalidation, create an API token in Strapi

## 📊 Analytics

To add Google Analytics:

1. Get your GA4 measurement ID
2. Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Add Google Analytics script to `frontend/app/layout.tsx`

## 🚧 Future Enhancements

- [ ] AI chatbot integration
- [ ] Payment processing (Stripe)
- [ ] Email automation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Advanced search functionality
- [ ] User authentication
- [ ] Comment system for blog posts
- [ ] Newsletter subscription

## 📚 Tech Stack

### Frontend
- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Next SEO](https://github.com/garmeeh/next-seo) - SEO optimization

### CMS
- [Strapi v5](https://strapi.io/) - Headless CMS
- [SQLite](https://www.sqlite.org/) - Database (development)
- [PostgreSQL](https://www.postgresql.org/) - Database (production recommended)

### DevOps
- [Vercel](https://vercel.com/) - Frontend hosting
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) - CMS hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## 🤝 Contributing

This is a proprietary starter template for Helpables LLC. For internal development:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure CI passes

## 📄 License

Copyright © 2025 Helpables LLC. All rights reserved.

## 💬 Support

For questions or support, contact: hello@helpables.io

---

**Built with ❤️ by Helpables LLC**
