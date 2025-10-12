# Strapi CMS - Docker Setup Guide

## Why Docker?

The current system has Node.js v24, but Strapi v4 requires Node.js 18-20. Docker provides a consistent environment regardless of your local Node version.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Git (for version control)

## Local Development with Docker

### Step 1: Create Dockerfile

Create `cms/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 1337

# Set environment
ENV NODE_ENV=development

# Start Strapi
CMD ["npm", "run", "develop"]
```

### Step 2: Create docker-compose.yml

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  cms:
    build: ./cms
    container_name: helpables-cms
    ports:
      - '1337:1337'
    volumes:
      - ./cms:/app
      - /app/node_modules
    environment:
      - DATABASE_CLIENT=better-sqlite3
      - DATABASE_FILENAME=/app/.tmp/data.db
      - HOST=0.0.0.0
      - PORT=1337
    env_file:
      - ./cms/.env
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: helpables-frontend
    ports:
      - '3000:3000'
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
    env_file:
      - ./frontend/.env.local
    depends_on:
      - cms
    restart: unless-stopped
```

### Step 3: Create Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "dev"]
```

### Step 4: Start Services

```powershell
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Step 5: Access Applications

- **CMS Admin**: http://localhost:1337/admin
- **Frontend**: http://localhost:3000

### Step 6: Create Admin Account

1. Navigate to http://localhost:1337/admin
2. Fill in the admin registration form
3. Create your first admin user

### Step 7: Configure API Permissions

1. Go to Settings → Roles → Public
2. Enable permissions for:
   - **Blog**: `find`, `findOne`
   - **Service**: `find`, `findOne`
   - **Testimonial**: `find`, `findOne`
   - **FAQ**: `find`, `findOne`
   - **Homepage**: `find`
3. Click **Save**

## Docker Commands

```powershell
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View CMS logs only
docker-compose logs -f cms

# Rebuild after code changes
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v

# Execute commands in CMS container
docker-compose exec cms npx strapi --help

# Access CMS container shell
docker-compose exec cms sh
```

## Production Deployment

### Azure Container Instance

```powershell
# Build production image
docker build -t helpables-cms:latest ./cms

# Tag for Azure Container Registry
docker tag helpables-cms:latest <yourregistry>.azurecr.io/helpables-cms:latest

# Push to ACR
docker push <yourregistry>.azurecr.io/helpables-cms:latest

# Deploy to Azure Container Instance
az container create \
  --resource-group helpables-rg \
  --name helpables-cms \
  --image <yourregistry>.azurecr.io/helpables-cms:latest \
  --dns-name-label helpables-cms \
  --ports 1337 \
  --environment-variables \
    NODE_ENV=production \
    DATABASE_CLIENT=postgres \
    DATABASE_HOST=<your-db>.postgres.database.azure.com \
    DATABASE_PORT=5432 \
    DATABASE_NAME=strapi \
    DATABASE_USERNAME=<username> \
  --secure-environment-variables \
    DATABASE_PASSWORD=<password> \
    APP_KEYS=<your-keys> \
    API_TOKEN_SALT=<your-salt> \
    ADMIN_JWT_SECRET=<your-secret> \
    JWT_SECRET=<your-secret>
```

### Azure App Service with Docker

1. Create Azure App Service (Linux)
2. Configure Container Settings:
   - Image Source: Azure Container Registry
   - Image: helpables-cms
   - Tag: latest
3. Add Application Settings (Environment Variables)
4. Enable Continuous Deployment

## Troubleshooting

### Port Already in Use

```powershell
# Find process using port 1337
netstat -ano | findstr :1337

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Permission Errors

```powershell
# On Windows, ensure Docker Desktop has proper permissions
# Run PowerShell as Administrator if needed
```

### Database Issues

```powershell
# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up --build
```

### View Container Logs

```powershell
# Real-time logs
docker-compose logs -f cms

# Last 100 lines
docker-compose logs --tail=100 cms
```

## Next Steps

1. ✅ Run `docker-compose up` to start both CMS and frontend
2. ✅ Create admin account at http://localhost:1337/admin
3. ✅ Configure public API permissions
4. ✅ Add sample content
5. ✅ Test frontend at http://localhost:3000
6. 🚀 Deploy to Azure when ready

## Benefits of Docker

- ✅ **Consistent Environment**: Same Node version everywhere
- ✅ **Easy Setup**: One command to start everything
- ✅ **Isolated**: Won't conflict with your system Node version
- ✅ **Production-Ready**: Same setup for dev and production
- ✅ **Scalable**: Easy to add services (database, cache, etc.)

## Alternative: Use NVM (Node Version Manager)

If you prefer not to use Docker:

1. Install NVM for Windows
2. Install Node 20: `nvm install 20`
3. Use Node 20: `nvm use 20`
4. Run `npm install` and `npm run develop` in cms folder

---

**Need Help?** Contact hello@helpables.io
