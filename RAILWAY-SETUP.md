# Railway CMS Deployment Guide

## Step 1: Add PostgreSQL Database

1. Go to your Railway project dashboard
2. Click **"+ New"** button
3. Select **"Database"** → **"Add PostgreSQL"**
4. Railway will automatically create a PostgreSQL database

## Step 2: Link Database to Your CMS Service

Railway should automatically add these environment variables to your CMS service:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `DATABASE_URL`

## Step 3: Add Required Environment Variables

In your Railway CMS service, add these variables:

### Database Configuration
```
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=false
```

### Strapi Security Keys
Generate these with the command:
```bash
node -e "const crypto = require('crypto'); console.log('APP_KEYS=' + crypto.randomBytes(16).toString('base64') + ',' + crypto.randomBytes(16).toString('base64')); console.log('API_TOKEN_SALT=' + crypto.randomBytes(16).toString('base64')); console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(16).toString('base64')); console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(16).toString('base64')); console.log('JWT_SECRET=' + crypto.randomBytes(16).toString('base64'));"
```

Then add them to Railway:
```
APP_KEYS=<key1>,<key2>
API_TOKEN_SALT=<your-salt>
ADMIN_JWT_SECRET=<your-secret>
TRANSFER_TOKEN_SALT=<your-salt>
JWT_SECRET=<your-secret>
```

### Other Required Variables
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

## Step 4: Deploy

Once all environment variables are set, Railway will automatically redeploy your CMS.

## Step 5: Access Your CMS

1. Railway will give you a public URL (e.g., `your-app.up.railway.app`)
2. Go to `https://your-app.up.railway.app/admin`
3. Create your admin account

## Step 6: Configure API Permissions

1. Log into your CMS admin panel
2. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
3. Enable **find** and **findOne** for these collections:
   - Blog
   - Service
   - Testimonial
   - Homepage
   - FAQ
4. Click **Save**

## Troubleshooting

### Build Fails
- Check that `DATABASE_CLIENT=postgres` is set
- Verify PostgreSQL database is running
- Check Railway logs for specific errors

### Can't Access Admin
- Make sure the service is deployed and running
- Check the public URL in Railway settings
- Try accessing `/admin` path specifically

### Database Connection Issues
- Verify all DATABASE_* variables are set correctly
- Check that PostgreSQL database is in the same Railway project
- Ensure DATABASE_SSL=false (Railway handles SSL internally)

## Next Steps

After your CMS is deployed:
1. Copy your Railway CMS URL
2. Use it to deploy your frontend to Netlify
3. Set `NEXT_PUBLIC_STRAPI_URL` in Netlify to your Railway URL
