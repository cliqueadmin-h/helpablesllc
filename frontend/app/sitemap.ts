import { MetadataRoute } from 'next';
import { getEntries } from '@/lib/cms';

const BASE_URL = 'https://helpables.io';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const [services, posts] = await Promise.all([
      getEntries('services', { pagination: { pageSize: 100 } }),
      getEntries('blogs', { pagination: { pageSize: 100 } }),
    ]);

    const serviceRoutes: MetadataRoute.Sitemap = (services ?? [])
      .filter((s: any) => s?.attributes?.slug)
      .map((service: any) => ({
        url: `${BASE_URL}/services/${service.attributes.slug}`,
        lastModified: new Date(service.attributes.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? [])
      .filter((p: any) => p?.attributes?.slug)
      .map((post: any) => ({
        url: `${BASE_URL}/blog/${post.attributes.slug}`,
        lastModified: new Date(post.attributes.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
