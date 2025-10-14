import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helpables LLC - Empowering Your Digital Transformation",
  description: "Helpables LLC provides innovative solutions for your business needs, from AI integration to custom development and automation.",
  keywords: ["business solutions", "AI integration", "automation", "digital transformation", "Helpables"],
  authors: [{ name: "Helpables LLC" }],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Helpables LLC - Empowering Your Digital Transformation",
    description: "Innovative solutions for your business needs",
    url: "https://helpables.com",
    siteName: "Helpables LLC",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Helpables LLC",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helpables LLC - Empowering Your Digital Transformation",
    description: "Innovative solutions for your business needs",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`}>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
