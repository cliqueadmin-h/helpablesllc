import { notFound } from 'next/navigation';
import CMSRenderer from '@/components/CMSRenderer';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getPrivacyPolicy() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/privacy?populate=*`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }
}

export async function generateMetadata() {
  const privacy = await getPrivacyPolicy();
  
  return {
    title: privacy?.attributes?.title || 'Privacy Policy | Helpables',
    description: privacy?.attributes?.metaDescription || 'Our privacy policy explains how we collect, use, and protect your personal information.',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage() {
  const privacy = await getPrivacyPolicy();

  if (!privacy) {
    notFound();
  }

  const { title, content, lastUpdated } = privacy.attributes;
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg text-white/90">
              Last Updated: {formattedDate}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-heading prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
              prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
            ">
              <CMSRenderer content={content} />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you have any questions about our privacy policy, please{' '}
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
