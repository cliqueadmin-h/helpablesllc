import { getEntries, getEntryBySlug, getStrapiImageUrl, formatDate } from '@/lib/cms';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CMSRenderer from '@/components/CMSRenderer';
import type { Metadata } from 'next';

export const revalidate = 60;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const blogs = await getEntries('blogs');
  
  return blogs.map((blog) => ({
    slug: blog.attributes.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = await getEntryBySlug('blogs', params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const imageUrl = getStrapiImageUrl(blog.attributes.coverImage);

  return {
    title: `${blog.attributes.title} - Helpables LLC`,
    description: blog.attributes.excerpt || blog.attributes.title,
    openGraph: {
      title: blog.attributes.title,
      description: blog.attributes.excerpt || blog.attributes.title,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await getEntryBySlug('blogs', params.slug);

  if (!blog) {
    notFound();
  }

  const coverImageUrl = getStrapiImageUrl(blog.attributes.coverImage);

  return (
    <article className="min-h-screen bg-light dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container-custom">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 max-w-4xl">
            {blog.attributes.title}
          </h1>
          {blog.attributes.excerpt && (
            <p className="text-xl text-white/90 mb-4 max-w-3xl">
              {blog.attributes.excerpt}
            </p>
          )}
          <div className="text-white/80 text-lg">
            {formatDate(blog.attributes.createdAt)}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="container-custom -mt-16 mb-12">
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={coverImageUrl}
              alt={blog.attributes.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
            <CMSRenderer content={blog.attributes.body} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-dark dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </article>
  );
}
