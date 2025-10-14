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
  videoUrl?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/contact',
  imageUrl,
  videoUrl,
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Video Background */}
      {videoUrl ? (
        <>
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-light via-white to-light-gray dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      )}

      {/* Content */}
      <div className="container-custom py-20 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight ${
              videoUrl || imageUrl ? 'text-white' : 'text-dark dark:text-white'
            }`}>
              {title}
            </h1>
            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
              videoUrl || imageUrl ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={ctaLink} className="btn-primary">
                {ctaText}
              </Link>
              <Link 
                href="/services" 
                className={videoUrl || imageUrl 
                  ? "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  : "btn-outline"
                }
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
