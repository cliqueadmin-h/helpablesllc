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
  title: "Helpables LLC - AI Automation & Digital Agency",
  description: "Helpables LLC is an AI-first digital agency offering CRM automation, GoHighLevel setup, lead generation, missed-call text back, web & mobile app development, and n8n workflows for small businesses.",
  keywords: [
    "AI automation agency",
    "digital agency",
    "GoHighLevel",
    "CRM automation",
    "lead generation",
    "missed call text back",
    "n8n workflows",
    "web app development",
    "Helpables",
    "helpables.io",
    "small business automation",
    "AI integration",
  ],
  authors: [{ name: "Helpables LLC" }],
  metadataBase: new URL("https://helpables.io"),
  alternates: {
    canonical: "https://helpables.io",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Helpables LLC - Empowering Your Digital Transformation",
    description: "Innovative solutions for your business needs",
    url: "https://helpables.io",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"69227426d28b6e0021a5803d"})},document.head.appendChild(o)}initApollo();`,
          }}
        />
      </head>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
