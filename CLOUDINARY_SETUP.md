# Cloudinary Setup for Helpables LLC

## Why Cloudinary?

Railway uses **ephemeral storage**, meaning any files uploaded to Strapi are stored on the container's filesystem and get **deleted when the container restarts**. This is why your hero video disappeared.

Cloudinary provides:
- **Persistent cloud storage** for all media files
- **Automatic image/video optimization**
- **CDN delivery** for faster loading
- **Free tier** with generous limits (25GB storage, 25GB bandwidth/month)

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After logging in, you'll see your **Dashboard**

### 2. Get Your Credentials

From your Cloudinary Dashboard, copy these three values:

- **Cloud Name**: (e.g., `dxxxxxxxxx`)
- **API Key**: (e.g., `123456789012345`)
- **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Add Environment Variables to Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **Strapi project** (helpablesllc-production)
3. Click on **Variables** tab
4. Add these three new variables:

```
CLOUDINARY_NAME=your_cloud_name_here
CLOUDINARY_KEY=your_api_key_here
CLOUDINARY_SECRET=your_api_secret_here
```

**Example:**
```
CLOUDINARY_NAME=dxxxxxxxxx
CLOUDINARY_KEY=123456789012345
CLOUDINARY_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Deploy Changes

The configuration is already set up in the code. Once you add the environment variables:

1. Railway will automatically redeploy with Cloudinary integration
2. All future uploads will go to Cloudinary
3. Existing files in Strapi will need to be re-uploaded

### 5. Re-upload Your Hero Video

After the deployment completes:

1. Go to [Strapi Admin](https://helpablesllc-production.up.railway.app/admin)
2. Click **Content Manager** → **Single Types** → **Homepage**
3. In the **Hero Video** field, delete the current video (it's broken anyway)
4. Upload your hero video again
5. Click **Save**
6. The video will now be stored on Cloudinary permanently

## Verification

After re-uploading, you can verify Cloudinary is working:

1. In Strapi, click on the uploaded video
2. The URL should now look like: `https://res.cloudinary.com/YOUR_CLOUD_NAME/...`
3. Your website hero section should show the video correctly

## Benefits

✅ **Persistent Storage** - Files survive container restarts  
✅ **Fast CDN Delivery** - Videos load faster globally  
✅ **Automatic Optimization** - Cloudinary optimizes file sizes  
✅ **Free Tier** - 25GB storage & bandwidth/month  
✅ **No Code Changes** - Works automatically after setup  

## Troubleshooting

**Video still not showing after re-upload:**
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors
- Verify Cloudinary credentials are correct in Railway

**Upload fails in Strapi:**
- Check Railway logs for Cloudinary errors
- Verify API credentials are correct
- Check if you've exceeded Cloudinary free tier limits

## Next Steps

After setting up Cloudinary, you can also:
- Upload a hero image as a fallback
- Add more media to services, blog posts, etc.
- All uploads will automatically use Cloudinary
