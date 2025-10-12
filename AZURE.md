# Azure Deployment Guide

This guide covers deploying the Strapi CMS to Azure App Service.

## Prerequisites

- Azure account
- Azure CLI installed
- Git repository set up

## Method 1: Azure Portal

1. **Create a Web App**
   - Go to Azure Portal
   - Create new resource → Web App
   - Runtime: Node 20 LTS
   - Region: Choose closest to your users

2. **Configure Application Settings**

Add these environment variables in Configuration:

```
HOST=0.0.0.0
PORT=8080
DATABASE_CLIENT=postgres
DATABASE_HOST=<your-postgres-host>
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_SSL=true
APP_KEYS=<generate-secure-keys>
API_TOKEN_SALT=<generate-salt>
ADMIN_JWT_SECRET=<generate-secret>
TRANSFER_TOKEN_SALT=<generate-salt>
JWT_SECRET=<generate-secret>
NODE_ENV=production
```

3. **Set up PostgreSQL**
   - Create Azure Database for PostgreSQL
   - Note connection details
   - Update connection string in app settings

4. **Deploy from GitHub**
   - Go to Deployment Center
   - Choose GitHub
   - Select your repository and branch
   - Save

## Method 2: Azure CLI

```bash
# Login
az login

# Create resource group
az group create --name helpables-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name helpables-plan \
  --resource-group helpables-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group helpables-rg \
  --plan helpables-plan \
  --name helpables-cms \
  --runtime "NODE:20-lts"

# Configure deployment from GitHub
az webapp deployment source config \
  --name helpables-cms \
  --resource-group helpables-rg \
  --repo-url https://github.com/your-org/your-repo \
  --branch main \
  --manual-integration

# Set environment variables
az webapp config appsettings set \
  --resource-group helpables-rg \
  --name helpables-cms \
  --settings HOST=0.0.0.0 PORT=8080 NODE_ENV=production
```

## Method 3: GitHub Actions (Recommended)

Use the included workflow file. Add these secrets to your GitHub repository:

- `AZURE_WEBAPP_NAME`: Your app service name
- `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal

## Database Setup

### Using Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group helpables-rg \
  --name helpables-db \
  --location eastus \
  --admin-user adminuser \
  --admin-password <secure-password> \
  --sku-name Standard_B1ms \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group helpables-rg \
  --server-name helpables-db \
  --database-name strapi

# Configure firewall to allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group helpables-rg \
  --name helpables-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Update Strapi Database Config

Update `cms/config/database.js` for production:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: false
      },
    },
    debug: false,
  },
});
```

## Monitoring

- Use Azure Application Insights for monitoring
- Enable diagnostic logging in Azure Portal
- Set up alerts for errors and performance issues

## Scaling

- Scale up: Increase App Service plan tier
- Scale out: Increase instance count (requires higher tier)

## Custom Domain

1. Add custom domain in Azure Portal
2. Configure DNS records
3. Add SSL certificate (free with App Service)

## Troubleshooting

- Check logs: `az webapp log tail --name helpables-cms --resource-group helpables-rg`
- SSH into container: Available in Azure Portal under Development Tools
- Review Application Insights for errors
