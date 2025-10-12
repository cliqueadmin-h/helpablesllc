interface StrapiImage {
  data: {
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    };
  } | null;
}

interface StrapiEntry {
  id: number;
  attributes: {
    [key: string]: any;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

interface StrapiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Fetch entries from Strapi CMS
 * @param type - The content type to fetch (e.g., 'blogs', 'services')
 * @param options - Optional query parameters
 */
export async function getEntries(
  type: string,
  options: {
    populate?: string;
    filters?: Record<string, any>;
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  } = {}
): Promise<StrapiEntry[]> {
  const { populate = '*', filters, sort, pagination } = options;
  
  const params = new URLSearchParams();
  params.append('populate', populate);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.append(`filters[${key}]`, value);
    });
  }
  
  if (sort) {
    params.append('sort', sort);
  }
  
  if (pagination) {
    if (pagination.page) params.append('pagination[page]', pagination.page.toString());
    if (pagination.pageSize) params.append('pagination[pageSize]', pagination.pageSize.toString());
  }
  
  try {
    const res = await fetch(`${STRAPI_URL}/api/${type}?${params.toString()}`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type}: ${res.statusText}`);
    }
    
    const json: StrapiResponse<StrapiEntry[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

/**
 * Fetch a single entry from Strapi CMS by ID
 */
export async function getEntry(
  type: string,
  id: string | number,
  populate: string = '*'
): Promise<StrapiEntry | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${type}/${id}?populate=${populate}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type}/${id}: ${res.statusText}`);
    }
    
    const json: StrapiResponse<StrapiEntry> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching ${type}/${id}:`, error);
    return null;
  }
}

/**
 * Fetch a single entry by slug
 */
export async function getEntryBySlug(
  type: string,
  slug: string,
  populate: string = '*'
): Promise<StrapiEntry | null> {
  try {
    const entries = await getEntries(type, {
      populate,
      filters: { slug },
    });
    
    return entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.error(`Error fetching ${type} by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Helper to get image URL from Strapi
 */
export function getStrapiImageUrl(image: StrapiImage | null | undefined): string | null {
  if (!image?.data?.attributes?.url) return null;
  
  const url = image.data.attributes.url;
  
  // If the URL is relative, prepend the Strapi URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }
  
  return url;
}

/**
 * Format Strapi date to readable format
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export type { StrapiEntry, StrapiImage, StrapiResponse };
