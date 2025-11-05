// Test what URL is being generated for the video
const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

const heroVideo = {
  "data": {
    "id": 3,
    "attributes": {
      "name": "18069232_uhd_3840_2160_24fps.mp4",
      "alternativeText": null,
      "caption": null,
      "width": null,
      "height": null,
      "formats": null,
      "hash": "18069232_uhd_3840_2160_24fps_e0e100dc16",
      "ext": ".mp4",
      "mime": "video/mp4",
      "size": 14066.64,
      "url": "/uploads/18069232_uhd_3840_2160_24fps_e0e100dc16.mp4",
      "previewUrl": null,
      "provider": "local",
      "provider_metadata": null,
      "createdAt": "2025-01-18T22:19:53.906Z",
      "updatedAt": "2025-01-18T22:19:53.906Z"
    }
  }
};

function getStrapiImageUrl(image) {
  if (!image?.data?.attributes?.url) return null;
  
  const url = image.data.attributes.url;
  
  // If it's a relative URL, prepend the Strapi URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }
  
  return url;
}

const videoUrl = getStrapiImageUrl(heroVideo);
console.log('Video URL:', videoUrl);
console.log('Expected:', 'https://helpablesllc-production.up.railway.app/uploads/18069232_uhd_3840_2160_24fps_e0e100dc16.mp4');
