# Deploy Strapi CMS to Azure App Service

## Overview

This guide walks you through deploying your Strapi CMS to Azure App Service with PostgreSQL database.

## Prerequisites

- Azure account with active subscription
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Docker installed (for container deployment option)
- Azure CLI logged in: `az login`

## Method 1: Deploy with Azure App Service (Docker Container)

### Step 1: Create Resource Group

```powershell
# Set variables
$RESOURCE_GROUP="helpables-rg"
$LOCATION="eastus"
$APP_NAME="helpables-cms"
$DB_NAME="helpables-db"
$DB_SERVER="helpables-db-server"

# Create resource group
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION
```

### Step 2: Create Azure Container Registry (ACR)

```powershell
$ACR_NAME="helpablesacr"  # Must be globally unique, lowercase, no hyphens

# Create ACR
az acr create `
  --resource-group $RESOURCE_GROUP `
  --name $ACR_NAME `
  --sku Basic `
  --admin-enabled true

# Get ACR credentials
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query username -o tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv
```

### Step 3: Create PostgreSQL Database

```powershell
# Create PostgreSQL server
az postgres flexible-server create `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER `
  --location $LOCATION `
  --admin-user strapiuser `
  --admin-password "YourSecurePassword123!" `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --storage-size 32 `
  --version 14

# Create database
az postgres flexible-server db create `
  --resource-group $RESOURCE_GROUP `
  --server-name $DB_SERVER `
  --database-name strapi

# Configure firewall (allow Azure services)
az postgres flexible-server firewall-rule create `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

### Step 4: Build and Push Docker Image

```powershell
# Log in to ACR
az acr login --name $ACR_NAME

# Build and push CMS image
docker build -t "$ACR_NAME.azurecr.io/helpables-cms:latest" ./cms
docker push "$ACR_NAME.azurecr.io/helpables-cms:latest"
```

### Step 5: Create App Service Plan

```powershell
az appservice plan create `
  --name helpables-plan `
  --resource-group $RESOURCE_GROUP `
  --is-linux `
  --sku B1
```

### Step 6: Generate Secrets

```powershell
# Generate random secrets using PowerShell
$APP_KEY1 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
$APP_KEY2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
$API_TOKEN_SALT = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
$ADMIN_JWT_SECRET = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
$TRANSFER_TOKEN_SALT = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
$JWT_SECRET = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

Write-Host "APP_KEYS=$APP_KEY1,$APP_KEY2"
Write-Host "API_TOKEN_SALT=$API_TOKEN_SALT"
Write-Host "ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET"
Write-Host "TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT"
Write-Host "JWT_SECRET=$JWT_SECRET"
```

### Step 7: Create Web App

```powershell
# Get database connection details
$DB_HOST="$DB_SERVER.postgres.database.azure.com"

# Create web app
az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan helpables-plan `
  --name $APP_NAME `
  --deployment-container-image-name "$ACR_NAME.azurecr.io/helpables-cms:latest"

# Configure container registry
az webapp config container set `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --docker-custom-image-name "$ACR_NAME.azurecr.io/helpables-cms:latest" `
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io" `
  --docker-registry-server-user $ACR_USERNAME `
  --docker-registry-server-password $ACR_PASSWORD
```

### Step 8: Configure Environment Variables

```powershell
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings `
    NODE_ENV=production `
    HOST=0.0.0.0 `
    PORT=8080 `
    DATABASE_CLIENT=postgres `
    DATABASE_HOST=$DB_HOST `
    DATABASE_PORT=5432 `
    DATABASE_NAME=strapi `
    DATABASE_USERNAME=strapiuser `
    DATABASE_PASSWORD="YourSecurePassword123!" `
    DATABASE_SSL=true `
    APP_KEYS="$APP_KEY1,$APP_KEY2" `
    API_TOKEN_SALT=$API_TOKEN_SALT `
    ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET `
    TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT `
    JWT_SECRET=$JWT_SECRET `
    WEBSITES_PORT=1337
```

### Step 9: Enable Continuous Deployment

```powershell
az webapp deployment container config `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --enable-cd true
```

### Step 10: Restart App

```powershell
az webapp restart `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP
```

### Step 11: Access Your CMS

```powershell
# Get the URL
az webapp show `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query defaultHostName `
  --output tsv
```

Visit: `https://<your-app-name>.azurewebsites.net/admin`

## Method 2: Deploy with GitHub Actions

### Step 1: Set up GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

- `AZURE_WEBAPP_NAME`: Your app service name
- `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal
- `ACR_USERNAME`: Your ACR username
- `ACR_PASSWORD`: Your ACR password
- `ACR_NAME`: Your ACR name

### Step 2: The GitHub Action is Already Configured!

The `.github/workflows/deploy.yml` file is already set up. Just push to the `main` branch:

```powershell
git add .
git commit -m "Deploy to Azure"
git push origin main
```

## Method 3: Deploy from Local Git

### Step 1: Configure Local Git Deployment

```powershell
# Configure deployment source
az webapp deployment source config-local-git `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP

# Get deployment credentials
az webapp deployment list-publishing-credentials `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP
```

### Step 2: Push to Azure

```powershell
# Add Azure remote
git remote add azure https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git

# Push to Azure
git push azure main
```

## Database Migration

### Export Local Data

```powershell
# Inside CMS container
docker-compose exec cms npm run strapi export -- --file backup.tar.gz

# Copy from container
docker cp helpables-cms:/app/backup.tar.gz ./backup.tar.gz
```

### Import to Production

```powershell
# Upload to Azure
az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --src backup.tar.gz

# Import in Azure (using SSH or Kudu console)
npm run strapi import -- --file backup.tar.gz
```

## Monitoring

### View Logs

```powershell
# Stream logs
az webapp log tail `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP

# Download logs
az webapp log download `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME
```

### Enable Application Insights

```powershell
# Create Application Insights
az monitor app-insights component create `
  --app $APP_NAME `
  --location $LOCATION `
  --resource-group $RESOURCE_GROUP

# Get instrumentation key
$APPINSIGHTS_KEY = az monitor app-insights component show `
  --app $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query instrumentationKey `
  --output tsv

# Configure app
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings `
    APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY
```

## Scaling

### Scale Up (Vertical)

```powershell
# Upgrade to Standard tier
az appservice plan update `
  --name helpables-plan `
  --resource-group $RESOURCE_GROUP `
  --sku S1
```

### Scale Out (Horizontal)

```powershell
# Add more instances
az appservice plan update `
  --name helpables-plan `
  --resource-group $RESOURCE_GROUP `
  --number-of-workers 3
```

## Custom Domain

### Add Custom Domain

```powershell
# Add domain
az webapp config hostname add `
  --webapp-name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --hostname cms.helpables.io

# Enable HTTPS
az webapp config ssl bind `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --certificate-thumbprint <thumbprint> `
  --ssl-type SNI
```

## Troubleshooting

### Container Won't Start

```powershell
# Check container logs
az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP

# Check container settings
az webapp config show --name $APP_NAME --resource-group $RESOURCE_GROUP
```

### Database Connection Issues

```powershell
# Test database connectivity
az postgres flexible-server connect `
  --name $DB_SERVER `
  --admin-user strapiuser `
  --admin-password "YourSecurePassword123!"
```

### Reset Admin Password

SSH into the app and run:

```bash
npm run strapi admin:reset-user-password --email=admin@example.com --password=NewPassword123
```

## Cost Estimation

| Resource | SKU | Monthly Cost (Estimated) |
|----------|-----|--------------------------|
| App Service | B1 | ~$13 |
| PostgreSQL | B1ms | ~$12 |
| Container Registry | Basic | ~$5 |
| **Total** | | **~$30/month** |

## Next Steps

1. ✅ Deploy CMS to Azure
2. ✅ Configure custom domain
3. ✅ Set up SSL certificate
4. ✅ Configure CDN for media files
5. ✅ Set up backup automation
6. ✅ Configure monitoring alerts

---

**Need Help?** Contact hello@helpables.io
