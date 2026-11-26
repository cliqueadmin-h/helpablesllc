import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactNode } from 'react';

export async function generateMetadata(
  _params: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;

  return {
    title: "Contact Helpables | Book a Consultation",
    description: "Send a project inquiry or book a free 30-minute consultation with Helpables.",
    alternates: { canonical: '/contact' },
    openGraph: { ...openGraph, url: '/contact' },
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
