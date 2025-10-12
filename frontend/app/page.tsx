import { getEntries, getStrapiImageUrl } from '@/lib/cms';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch homepage, services, and testimonials from CMS
  const [homepageData, services, testimonials] = await Promise.all([
    getEntries('homepage'),
    getEntries('services', { pagination: { pageSize: 3 } }),
    getEntries('testimonials', { pagination: { pageSize: 3 } }),
  ]);

  const homepage = homepageData[0]?.attributes;

  return (
    <>
      {/* Hero Section */}
      <Hero
        title={homepage?.heroTitle || 'Empowering Your Digital Transformation'}
        subtitle={
          homepage?.heroSubtitle ||
          'Innovative solutions for modern businesses. From AI integration to custom automation, we help you succeed in the digital age.'
        }
        imageUrl={getStrapiImageUrl(homepage?.heroImage) || undefined}
      />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-dark mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="card">
                  {service.attributes.icon && (
                    <div className="text-4xl mb-4">{service.attributes.icon}</div>
                  )}
                  <h3 className="text-2xl font-heading font-semibold text-dark mb-3">
                    {service.attributes.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.attributes.description}</p>
                </div>
              ))
            ) : (
              // Fallback services
              <>
                <div className="card">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark mb-3">
                    AI Integration
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Leverage cutting-edge AI technologies to automate processes and gain
                    valuable insights.
                  </p>
                </div>
                <div className="card">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark mb-3">
                    Custom Development
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tailored software solutions built with modern technologies to meet your
                    specific needs.
                  </p>
                </div>
                <div className="card">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark mb-3">
                    Automation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Streamline your workflows with intelligent automation solutions that save
                    time and resources.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-dark mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="card">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-gray-700 mb-6 italic">
                    {testimonial.attributes.quote}
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-dark">
                      {testimonial.attributes.author}
                    </p>
                    {testimonial.attributes.company && (
                      <p className="text-sm text-gray-600">
                        {testimonial.attributes.company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how we can help you achieve your goals with innovative solutions.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-light-gray font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
