import Link from 'next/link';
import LeadWorkflowDemo from '@/components/LeadWorkflowDemo';
import { CapabilitySection, ConsultationSection, PricingSection } from '@/components/SalesSections';
import { consultationHref } from '@/lib/sales-offer';

export default function Home() {
  return (
    <div className="bg-[#f9faf9] dark:bg-[#0c1519]">
      <section className="sales-hero">
        <div className="container-custom grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.04fr_1fr] lg:gap-14 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Automation for small service businesses
            </p>
            <h1 className="max-w-2xl text-[2.65rem] font-semibold leading-[1.05] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-[4rem]">
              Give every inquiry a clear next step.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              We connect your website, inbox, and CRM so your team can track new leads, follow up, and see when a handoff fails.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href={consultationHref} className="sales-button">
                Book a free consultation <span aria-hidden="true">→</span>
              </Link>
              <a href="#pricing" className="rounded-sm font-semibold text-emerald-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:text-emerald-300">
                See pricing
              </a>
            </div>
          </div>
          <LeadWorkflowDemo />
        </div>
      </section>

      <CapabilitySection />

      <section className="border-t border-slate-200 py-14 dark:border-slate-800 sm:py-16">
        <div className="container-custom">
          <article className="grid gap-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-[#29483f] dark:bg-[#102621] sm:p-9 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-12">
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Built for Helpables</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Website inquiry notifications
              </h2>
            </div>
            <div className="space-y-3 leading-7 text-slate-700 dark:text-slate-300">
              <p>Our contact workflow captures the inquiry before attempting to notify our team. Temporary delivery failures can be retried, and duplicate notification attempts are blocked.</p>
              <p>We tested that a rejected notification leaves the inquiry saved and that a replay uses the same delivery key.</p>
            </div>
          </article>
        </div>
      </section>

      <PricingSection />
      <ConsultationSection />
    </div>
  );
}
