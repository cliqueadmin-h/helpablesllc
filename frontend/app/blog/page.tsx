import { getEntries } from '@/lib/cms';
import Link from 'next/link';
import type { Metadata } from 'next';
import { formatDate } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Blog - Helpables LLC',
  description: 'Read our latest articles on technology, business transformation, and innovation.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const blogs = await getEntries('blogs', { sort: 'createdAt:desc' });

  return (
    <div className="min-h-screen bg-light dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-heading font-bold mb-6">Our Blog</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Insights, tips, and stories from the world of technology and innovation
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container-custom">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.attributes.slug}`}
                  className="card hover:scale-105 transition-transform duration-200 group"
                >
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(blog.attributes.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {blog.attributes.title}
                  </h3>
                  {blog.attributes.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {blog.attributes.excerpt}
                    </p>
                  )}
                  <div className="mt-4 text-primary dark:text-secondary font-medium flex items-center">
                    Read More
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-4">
                No Blog Posts Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We're working on creating amazing content for you. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
