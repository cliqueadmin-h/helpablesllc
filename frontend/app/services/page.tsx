import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { CapabilitySection, ConsultationSection, PricingSection } from '@/components/SalesSections';
import { consultationHref } from '@/lib/sales-offer';

const engineeringServices = [
  {
    title: 'Custom business applications',
    description: 'Build internal portals, dashboards, and role-based tools around work your team already does. Start with one screen or workflow and written acceptance checks.',
  },
  {
    title: 'AI agents and document workflows',
    description: 'Turn documents into reviewable records, route exceptions to a person, and integrate approved actions with your existing systems.',
  },
  {
    title: 'CRM, integrations, and modernization',
    description: 'Connect your forms, CRM, and operating tools. Replace fragile integrations in stages and hand over tests, operational documentation, and source code.',
  },
];

export async function generateMetadata(
  _params: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;
  const title = 'Custom Software and AI Automation | Helpables';
  const description = 'Custom business software and AI automation. Start with a scoped lead workflow repair, or explore internal apps, document processing, and integrations.';

  return {
    title,
    description,
    alternates: { canonical: '/services' },
    openGraph: { ...openGraph, title, description, url: '/services' },
  };
}

export default function ServicesPage() {
  return (
    <div className="bg-[#f9faf9] dark:bg-[#0c1519]">
      <section className="sales-hero">
        <div className="container-custom py-14 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Lead capture and follow-up services
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Start with one workflow. We map how an inquiry becomes a conversation, then fix the handoffs that leave your team guessing.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href={consultationHref} className="sales-button">Book a free consultation <span aria-hidden="true">→</span></Link>
            <Link href="/#workflow-demo" className="rounded-sm font-semibold text-emerald-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:text-emerald-300">
              Try the workflow demo
            </Link>
          </div>
        </div>
      </section>
      <PricingSection />
      <CapabilitySection />
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20" aria-labelledby="engineering">
        <div className="container-custom">
          <h2 id="engineering" className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Custom software and AI automation
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Bring a process that wastes time or breaks between tools. We define the first working milestone and price it after discovery.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {engineeringServices.map(({ title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Invoice exception review demo</h3>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
              Compare fictional invoices and purchase orders, then filter to records that need human review. The demo runs in your browser.
            </p>
            <Link href="/demos/invoice-review/index.html" className="mt-3 inline-flex rounded-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300">
              Run the invoice review demo <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
      <ConsultationSection />
    </div>
  );
}
