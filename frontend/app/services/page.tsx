import { getEntries, parseShortSummary } from '@/lib/cms';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Services - Helpables LLC',
  description: 'Explore our comprehensive range of services including AI integration, custom development, and automation solutions.',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getEntries('services', {
    sort: 'order:asc',
  });

  return (
    <div className="min-h-screen bg-light dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-heading font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Comprehensive solutions designed to propel your business forward
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container-custom">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const attrs = service.attributes;
                const parsed = attrs.shortSummary ? parseShortSummary(attrs.shortSummary) : null;
                const slug = attrs.slug || attrs.title.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={service.id}
                    href={`/services/${slug}`}
                    className="card hover:scale-105 transition-transform duration-200 cursor-pointer group flex flex-col"
                  >
                    {attrs.icon && (
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                        {attrs.icon}
                      </div>
                    )}
                    <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {attrs.title}
                    </h3>

                    {parsed ? (
                      <>
                        {parsed.pricing && (
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3">
                            {parsed.pricing}
                          </p>
                        )}
                        {parsed.intro && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            {parsed.intro}
                          </p>
                        )}
                        {parsed.includes.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                              Includes
                            </p>
                            <ul className="space-y-1">
                              {parsed.includes.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {parsed.bestFor && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                            <span className="font-semibold">Best for:</span> {parsed.bestFor}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {attrs.description}
                      </p>
                    )}

                    <div className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 mt-4">
                      Learn More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Fallback content
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🤖',
                  title: 'AI Integration',
                  description:
                    'Harness the power of artificial intelligence to automate processes, gain insights, and improve decision-making across your organization.',
                },
                {
                  icon: '⚡',
                  title: 'Custom Development',
                  description:
                    'Build tailored software solutions using modern frameworks and best practices to meet your unique business requirements.',
                },
                {
                  icon: '🔄',
                  title: 'Process Automation',
                  description:
                    'Streamline repetitive tasks and workflows with intelligent automation that saves time and reduces errors.',
                },
                {
                  icon: '☁️',
                  title: 'Cloud Solutions',
                  description:
                    'Deploy scalable and secure cloud infrastructure on Azure, AWS, or Google Cloud to support your growing business.',
                },
                {
                  icon: '📊',
                  title: 'Data Analytics',
                  description:
                    'Transform raw data into actionable insights with advanced analytics and visualization tools.',
                },
                {
                  icon: '🔒',
                  title: 'Security & Compliance',
                  description:
                    'Protect your digital assets with enterprise-grade security measures and compliance frameworks.',
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="card hover:scale-105 transition-transform duration-200"
                >
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-dark mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We specialize in creating bespoke solutions tailored to your specific needs.
            Let's discuss your project.
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
