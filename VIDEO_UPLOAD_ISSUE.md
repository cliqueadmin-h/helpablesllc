# Video Upload Issue - Solutions

## Problem
Cloudinary is rejecting your video with "Unsupported video format or file" error.

## Cloudinary Free Tier Limitations

### Video Restrictions:
- **Max video size**: 100 MB
- **Max video duration**: 10 minutes (free tier)
- **Supported formats**: MP4, WebM, OGG
- **Supported codecs**: H.264, VP8, VP9, Theora
- **Resolution**: Up to 4K (but counts against storage)

## Solutions

### Option 1: Use an Image Instead (Recommended)

Instead of a video, use a high-quality image or animated GIF:

1. **Convert video to animated WebP/GIF** (smaller, supported):
   - Use [ezgif.com](https://ezgif.com/video-to-gif) to convert first 5-10 seconds
   - Keep under 5MB for best performance
   - Upload as Hero Image instead of Hero Video

2. **Use a static hero image**:
   - Much faster loading
   - Better for mobile users
   - Upload a compelling business/tech image

### Option 2: Optimize Your Video

If you must use video:

1. **Check your video file**:
   - What's the file size? (Should be < 100 MB)
   - What's the duration? (Should be < 10 minutes for free tier)
   - What's the format? (Should be MP4 with H.264 codec)

2. **Compress the video**:
   - Use [HandBrake](https://handbrake.fr/) (free)
   - Settings:
     - Format: MP4
     - Codec: H.264
     - Quality: 20-23 (RF)
     - Resolution: 1920x1080 max (1280x720 recommended)
     - Frame rate: 30 fps
     - Target size: < 20 MB for hero videos

3. **Trim the video**:
   - Hero videos should be 5-15 seconds max
   - Loop seamlessly
   - Cut unnecessary footage

### Option 3: Use YouTube/Vimeo Embed

Host video on YouTube/Vimeo and embed:

1. Upload to YouTube (unlisted)
2. Update Hero component to accept YouTube URL
3. Embed with `react-youtube` or iframe
4. Benefits: No storage limits, CDN included, better video player

### Option 4: Use a Different Provider

If Cloudinary's free tier doesn't work:

1. **Bunny.net** - $1/month for 500GB storage
2. **Cloudflare Stream** - $5/month for 1000 minutes
3. **AWS S3 + CloudFront** - Pay as you go, very cheap for small files

## Quick Test

What's your video file details?

```powershell
# If you have the video file locally:
Get-Item "path\to\your\video.mp4" | Select-Object Name, Length, Extension

# Convert bytes to MB:
(Get-Item "path\to\your\video.mp4").Length / 1MB
```

## My Recommendation

For a business website hero section:

✅ **Use a high-quality image** instead of video
- Faster loading
- Better SEO
- Works on all devices
- No storage/format issues
- Professional appearance

If you want motion:
- Use CSS animations
- Animated SVG graphics
- Background gradient animations
- Subtle parallax effects

These are lighter, faster, and more reliable than video backgrounds.

## Current Hero Component

The Hero component already supports both image and video. You can:

1. Go to Strapi Admin → Homepage
2. Upload a hero **image** (no size issues)
3. Remove the hero video field
4. Save

The site will look great with just an image!
