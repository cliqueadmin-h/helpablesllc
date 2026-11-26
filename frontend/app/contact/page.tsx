'use client';

import Link from 'next/link';
import { useState, Suspense, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import CalendlyWidget from '@/components/CalendlyWidget';
import { consultationHref, getOffer } from '@/lib/sales-offer';

const previewReadOnly = process.env.NEXT_PUBLIC_PREVIEW_READ_ONLY === '1';
const cmsUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : '');

const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Work email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
  { name: 'subject', label: 'Subject (optional)', type: 'text' },
] as const;

function ContactForm({ initialSubject }: { initialSubject: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (previewReadOnly || status === 'loading') return;

    const values = new FormData(event.currentTarget);
    const data = {
      name: String(values.get('name') ?? '').trim(),
      email: String(values.get('email') ?? '').trim(),
      phone: String(values.get('phone') ?? '').trim(),
      subject: String(values.get('subject') ?? '').trim(),
      message: String(values.get('message') ?? '').trim(),
    };

    setStatus('loading');
    try {
      if (!cmsUrl || !data.name || !data.message) throw new Error('Inquiry unavailable or incomplete');
      const response = await fetch(`${cmsUrl.replace(/\/$/, '')}/api/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error('Inquiry was not accepted');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-6" role="status">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Your inquiry was received.</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">We&apos;ll follow up at the email address you provided.</p>
        <button type="button" onClick={() => setStatus('idle')} className="sales-button mt-6">
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Project inquiry" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-2 block text-sm font-semibold">{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
              required={'required' in field && field.required}
              defaultValue={field.name === 'subject' ? initialSubject : undefined}
              maxLength={field.name === 'phone' ? 64 : 255}
              className="sales-field"
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold">What would you like to improve?</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="sales-field"
          placeholder="What happens when a new lead comes in today?"
        />
      </div>
      {status === 'error' && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-900 dark:bg-red-950 dark:text-red-200">
          We couldn&apos;t confirm your inquiry. Check the form and try again, or email{' '}
          <a className="font-semibold underline" href="mailto:support@helpables.org">support@helpables.org</a>.
        </p>
      )}
      <p className="text-sm text-slate-600 dark:text-slate-300">
        We use these details to respond to your inquiry. <Link href="/privacy" className="font-medium underline">Privacy policy</Link>
      </p>
      <button type="submit" disabled={status === 'loading'} className="sales-button">
        {status === 'loading' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}

function ContactContent() {
  const params = useSearchParams();
  const offer = getOffer(params.get('offer'));
  const activeTab = params.get('tab') === 'booking' ? 'booking' : 'message';
  const messageHref = offer ? `/contact?offer=${offer.id}` : '/contact';
  const bookingHref = offer ? `${messageHref}&tab=booking` : consultationHref;

  if (previewReadOnly) {
    return (
      <div className="container-custom py-14">
        <h1 className="text-4xl font-semibold">Contact Helpables</h1>
        <p className="mt-4">This preview is read-only. Messages and bookings are disabled.</p>
      </div>
    );
  }

  return (
    <div className="sales-hero min-h-[70vh] bg-[#f9faf9] dark:bg-[#0c1519]">
      <div className="container-custom grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {offer?.title || 'Tell us about your workflow'}
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
            {offer?.description || 'Tell us where leads get stuck today. We can discuss one workflow and agree what a useful next step would look like.'}
          </p>
          {offer && <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">{offer.price} USD {offer.basis} · indicative</p>}
          <a className="mt-6 inline-flex font-semibold text-emerald-800 hover:underline dark:text-emerald-300" href="mailto:support@helpables.org">
            support@helpables.org
          </a>
        </div>

        <section aria-label="Contact options" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#101e22] sm:p-7">
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="How to contact us">
            {([
              ['message', 'Send an inquiry', messageHref],
              ['booking', 'Book a free call', bookingHref],
            ] as const).map(([value, label, href]) => (
              <Link
                key={value}
                href={href}
                scroll={false}
                aria-current={activeTab === value ? 'page' : undefined}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 aria-[current=page]:border-emerald-700 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-900 dark:border-slate-600 dark:text-slate-200 dark:aria-[current=page]:border-emerald-500 dark:aria-[current=page]:bg-[#193d32] dark:aria-[current=page]:text-emerald-200"
              >
                {label}
              </Link>
            ))}
          </div>
          <div hidden={activeTab !== 'message'}>
            <ContactForm key={offer?.id ?? 'general'} initialSubject={offer?.subject ?? ''} />
          </div>
          {activeTab === 'booking' && <CalendlyWidget />}
        </section>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container-custom py-14" role="status">Loading contact options…</div>}>
      <ContactContent />
    </Suspense>
  );
}
