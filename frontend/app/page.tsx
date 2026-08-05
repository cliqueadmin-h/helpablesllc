import { getEntries, getSingleType, getStrapiImageUrl, parseShortSummary } from '@/lib/cms';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch homepage, services, and testimonials from CMS
  const [homepageData, services, testimonials] = await Promise.all([
    getSingleType('homepage'),
    getEntries('services', { 
      sort: 'order:asc',
      pagination: { pageSize: 3 } 
    }),
    getEntries('testimonials', { pagination: { pageSize: 3 } }),
  ]);

  const homepage = homepageData?.attributes;

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
        videoUrl={getStrapiImageUrl(homepage?.heroVideo) || undefined}
      />

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-dark dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service) => {
                const attrs = service.attributes;
                const parsed = attrs.shortSummary ? parseShortSummary(attrs.shortSummary) : null;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${attrs.slug}`}
                    className="card hover:scale-105 transition-transform duration-200 cursor-pointer group flex flex-col"
                  >
                    {attrs.icon && (
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{attrs.icon}</div>
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
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{attrs.description}</p>
                    )}
                  </Link>
                );
              })
            ) : (
              // Fallback services
              <>
                <div className="card">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3">
                    AI Integration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Leverage cutting-edge AI technologies to automate processes and gain
                    valuable insights.
                  </p>
                </div>
                <div className="card">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3">
                    Custom Development
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Tailored software solutions built with modern technologies to meet your
                    specific needs.
                  </p>
                </div>
                <div className="card">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3">
                    Automation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
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

      {/* Process Section */}
      <section className="py-20 bg-light dark:bg-gray-800 transition-colors">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-dark dark:text-white mb-4">
              AI That Is Measured, Tested, and Improved
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We do not simply connect an AI model and call the solution complete. Every
              Helpables AI system is designed to be accurate, reliable, secure, and
              cost-efficient in real-world use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Model and Prompt Optimization',
                description:
                  'We evaluate the right combination of models, prompts, context, and configuration for each use case, using domain-specific tuning to improve consistency, terminology, classification, formatting, and task performance.',
              },
              {
                step: '02',
                title: 'AI Evaluation and Testing',
                description:
                  'We create representative evaluation datasets and test AI outputs against defined quality standards—measuring accuracy, relevance, groundedness, consistency, safety, latency, and cost before and after implementation.',
              },
              {
                step: '03',
                title: 'Continuous AI Monitoring',
                description:
                  'Production AI behavior changes as users, data, prompts, and models evolve. We monitor failures, response quality, token usage, latency, tool execution, escalation rates, and unexpected behavior so problems are caught early.',
              },
              {
                step: '04',
                title: 'RAG and Knowledge Optimization',
                description:
                  'For systems that use company documents or internal knowledge, we optimize document preparation, chunking, embeddings, retrieval, metadata filtering, re-ranking, and citations to reduce unsupported answers.',
              },
              {
                step: '05',
                title: 'Reliability and Human Oversight',
                description:
                  'We implement validation rules, confidence thresholds, approval workflows, audit logs, fallback models, and human escalation for decisions that should not be made by AI alone.',
              },
              {
                step: '06',
                title: 'Measurable Improvement',
                description:
                  'Where possible, we provide a before-and-after AI scorecard so you can see the impact of every optimization we make.',
              },
            ].map((item) => (
              <div key={item.step} className="card flex flex-col">
                <span className="text-4xl font-heading font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {item.step}
                </span>
                <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 md:p-10 transition-colors">
            <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-2 text-center">
              Your AI Scorecard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              The result is not just an AI-powered product—it is an AI system that can be
              evaluated, monitored, and continuously improved.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                'Task success rate',
                'Answer accuracy',
                'Hallucination / unsupported-answer rate',
                'Response latency',
                'Cost per request',
                'Escalation rate',
                'User satisfaction',
              ].map((metric) => (
                <div key={metric} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-light dark:bg-gray-800 transition-colors">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-dark dark:text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="card">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    {testimonial.attributes.quote}
                  </p>
                  <div className="border-t dark:border-gray-600 pt-4">
                    <p className="font-semibold text-dark dark:text-white">
                      {testimonial.attributes.author}
                    </p>
                    {testimonial.attributes.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
