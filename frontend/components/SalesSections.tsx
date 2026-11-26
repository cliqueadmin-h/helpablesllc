import Link from 'next/link';
import { capabilities, consultationHref, offers } from '@/lib/sales-offer';

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Ways to work together
        </h2>
        <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          Indicative prices in USD. We confirm scope and pricing before you commit.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{offer.title}</h3>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <strong className="font-heading text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{offer.price}</strong>
                <span className="text-sm text-slate-600 dark:text-slate-300">{offer.basis}</span>
              </p>
              <p className="mb-7 mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{offer.description}</p>
              <Link
                href={`/contact?offer=${offer.id}`}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-sm font-semibold text-emerald-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:text-emerald-300"
              >
                {offer.linkText} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilitySection() {
  return (
    <section className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
      <div className="container-custom">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          What we set up
        </h2>
        <div className="mt-8 grid gap-x-8 gap-y-5 md:grid-cols-3">
          {capabilities.map((item) => (
            <article key={item.title} className="border-t border-slate-200 py-5 dark:border-slate-700">
              <div aria-hidden="true" className="mb-4 h-1 w-8 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConsultationSection() {
  return (
    <section className="border-t border-slate-200 bg-emerald-50 py-14 dark:border-slate-800 dark:bg-[#102621] sm:py-16">
      <div className="container-custom flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Where do your inquiries get stuck?
          </h2>
          <p className="mt-3 max-w-xl text-slate-700 dark:text-slate-300">
            Bring one example to a free 30-minute call. We&apos;ll discuss where it breaks and whether we can help.
          </p>
        </div>
        <Link href={consultationHref} className="sales-button shrink-0">
          Book a free consultation <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
