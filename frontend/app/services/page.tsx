import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { CapabilitySection, ConsultationSection, PricingSection } from '@/components/SalesSections';
import { consultationHref } from '@/lib/sales-offer';

export async function generateMetadata(
  _params: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;
  const title = 'Lead Workflow Services | Helpables';
  const description = 'Helpables sets up lead capture, follow-up and reliable handoffs for small service businesses. See pricing for discovery, implementation and support.';

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
      <ConsultationSection />
    </div>
  );
}
