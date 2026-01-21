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
 * Fetch a single type from Strapi CMS (e.g., homepage, about)
 * Single types return data directly, not in an array
 */
export async function getSingleType(
  type: string,
  populate: string = '*'
): Promise<any | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${type}?populate=${populate}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type}: ${res.statusText}`);
    }
    
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
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

// ============================================
// CREATE, UPDATE, DELETE OPERATIONS
// Requires authentication (JWT token)
// ============================================

interface UploadedFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
}

interface CreateEntryOptions {
  /** JWT token for authentication */
  token: string;
  /** Whether to publish immediately (default: false = draft) */
  publish?: boolean;
}

interface UpdateEntryOptions extends CreateEntryOptions {
  /** Entry ID to update */
  id: number | string;
}

/**
 * Upload a file/image to Strapi
 * Works with File objects (browser), Blob, or FormData
 * 
 * @example
 * // Browser file input
 * const file = inputElement.files[0];
 * const uploaded = await uploadFile(file, token);
 * 
 * @example
 * // React Native with image picker
 * const formData = new FormData();
 * formData.append('files', { uri, name, type });
 * const uploaded = await uploadFile(formData, token);
 */
export async function uploadFile(
  file: File | Blob | FormData,
  token: string
): Promise<UploadedFile | null> {
  try {
    let formData: FormData;
    
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('files', file);
    }

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || `Upload failed: ${res.statusText}`);
    }

    const uploadedFiles = await res.json();
    return uploadedFiles[0] || null;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload multiple files to Strapi
 */
export async function uploadFiles(
  files: File[] | FileList,
  token: string
): Promise<UploadedFile[]> {
  try {
    const formData = new FormData();
    
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      formData.append('files', file);
    });

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || `Upload failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

/**
 * Create a new entry in Strapi
 * 
 * @example
 * // Create a blog post
 * const blog = await createEntry('blogs', {
 *   title: 'My Blog Post',
 *   slug: 'my-blog-post',
 *   body: 'Content here...',
 *   excerpt: 'Short description',
 *   tags: 'tech, tutorial',
 *   coverImage: uploadedImageId, // ID from uploadFile()
 * }, { token: userJWT, publish: true });
 */
export async function createEntry(
  type: string,
  data: Record<string, any>,
  options: CreateEntryOptions
): Promise<StrapiEntry> {
  const { token, publish = false } = options;

  try {
    const payload: any = { data };
    
    // If publish is true, set publishedAt to now
    if (publish) {
      payload.data.publishedAt = new Date().toISOString();
    }

    const res = await fetch(`${STRAPI_URL}/api/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || `Failed to create ${type}: ${res.statusText}`);
    }

    const json: StrapiResponse<StrapiEntry> = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    throw error;
  }
}

/**
 * Update an existing entry in Strapi
 * 
 * @example
 * const updated = await updateEntry('blogs', {
 *   title: 'Updated Title',
 * }, { token: userJWT, id: 123 });
 */
export async function updateEntry(
  type: string,
  data: Record<string, any>,
  options: UpdateEntryOptions
): Promise<StrapiEntry> {
  const { token, id, publish } = options;

  try {
    const payload: any = { data };
    
    if (publish !== undefined) {
      payload.data.publishedAt = publish ? new Date().toISOString() : null;
    }

    const res = await fetch(`${STRAPI_URL}/api/${type}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || `Failed to update ${type}/${id}: ${res.statusText}`);
    }

    const json: StrapiResponse<StrapiEntry> = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error updating ${type}/${id}:`, error);
    throw error;
  }
}

/**
 * Delete an entry from Strapi
 * 
 * @example
 * await deleteEntry('blogs', 123, token);
 */
export async function deleteEntry(
  type: string,
  id: number | string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || `Failed to delete ${type}/${id}: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting ${type}/${id}:`, error);
    throw error;
  }
}

/**
 * Create a blog post with optional image upload
 * Convenience function that handles the two-step process
 * 
 * @example
 * // With image file
 * const blog = await createBlog({
 *   title: 'My Post',
 *   body: 'Content...',
 *   excerpt: 'Short desc',
 *   tags: 'tech',
 * }, token, imageFile);
 * 
 * @example
 * // Without image
 * const blog = await createBlog({
 *   title: 'My Post',
 *   body: 'Content...',
 * }, token);
 */
export async function createBlog(
  data: {
    title: string;
    body: string;
    slug?: string;
    excerpt?: string;
    tags?: string;
  },
  token: string,
  coverImage?: File | Blob | FormData,
  publish: boolean = false
): Promise<StrapiEntry> {
  try {
    // Generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const blogData: Record<string, any> = {
      ...data,
      slug,
    };

    // Upload cover image if provided
    if (coverImage) {
      const uploaded = await uploadFile(coverImage, token);
      if (uploaded) {
        blogData.coverImage = uploaded.id;
      }
    }

    return await createEntry('blogs', blogData, { token, publish });
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

export type { StrapiEntry, StrapiImage, StrapiResponse, UploadedFile, CreateEntryOptions, UpdateEntryOptions };
