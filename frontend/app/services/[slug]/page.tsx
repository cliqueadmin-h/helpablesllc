import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Service {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    icon: string;
    shortSummary: string;
    whatWeOffer: string;
    whatDifferentiatesUs: string;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

async function getService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 0 }, // No cache during testing
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.attributes.title} | Helpables LLC`,
    description: service.attributes.shortSummary || service.attributes.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  const { title, icon, shortSummary, description, whatWeOffer, whatDifferentiatesUs, videoUrl } = service.attributes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            href="/services" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          </div>
          {shortSummary && (
            <p className="text-xl text-white/90 mt-4">{shortSummary}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Video Embed */}
        {videoUrl && (
          <section className="mb-12">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={videoUrl}
                title={`${title} video`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Overview */}
        {description && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
          </section>
        )}

        {/* What We Offer */}
        {whatWeOffer && (
          <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @next/next/no-img-element
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-lg my-6 w-full h-auto"
                      alt={props.alt || 'Service image'}
                    />
                  ),
                }}
              >
                {whatWeOffer}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* What Differentiates Us */}
        {whatDifferentiatesUs && (
          <section className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What Differentiates Us</h2>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @next/next/no-img-element
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-lg my-6 w-full h-auto"
                      alt={props.alt || 'Service image'}
                    />
                  ),
                }}
              >
                {whatDifferentiatesUs}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Let's discuss how {title.toLowerCase()} can help your business grow.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Contact Us Today
          </Link>
        </section>
      </div>
    </div>
  );
}
