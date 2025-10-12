'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '#contact',
  imageUrl,
}: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-light via-white to-light-gray overflow-hidden">
      <div className="container-custom py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-dark mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={ctaLink} className="btn-primary">
                {ctaText}
              </Link>
              <Link href="/services" className="btn-outline">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {imageUrl ? (
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-dark">
                    Empowering Innovation
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
    </section>
  );
}
