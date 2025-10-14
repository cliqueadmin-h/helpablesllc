'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/helpables_logo.png" 
              alt="Helpables Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
            />
            <span className="font-heading font-bold text-xl text-dark dark:text-white">
              Helpables<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark dark:text-gray-200 hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            <Link 
              href="/contact?tab=booking" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>📅</span>
              <span>Book Free Consultation</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-light-gray"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-dark dark:text-gray-200 hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-dark dark:text-gray-200 font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <Link
              href="/contact?tab=booking"
              className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              📅 Book Free Consultation
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
