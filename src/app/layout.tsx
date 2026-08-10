import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://itskirkiri.vercel.app"),
  title: {
    default: "its.kirkiri | Handcrafted Gifts, Bouquets & Custom Craft",
    template: "%s | its.kirkiri"
  },
  description: "Add a little KIRKIRI in your life 💕 Mom & daughter handmade pipe-cleaner flower bouquets, custom hampers, cute pouches & home decor pieces from Lucknow.",
  keywords: [
    "its.kirkiri",
    "pipe cleaner bouquet",
    "handmade flower bouquets",
    "custom hampers Lucknow",
    "handmade gifts India",
    "pookie gifts",
    "Kirtika craft website",
    "custom order gifts"
  ],
  authors: [{ name: "Kirtika", url: "https://instagram.com/its.kirkiri" }],
  creator: "its.kirkiri",
  publisher: "its.kirkiri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "its.kirkiri | Handcrafted Gifts, Bouquets & Custom Craft 💖",
    description: "Add a little KIRKIRI in your life 💕 Handcrafted pipe-cleaner flower bouquets, custom hampers, pouches & home decor made with love in Lucknow.",
    url: "https://itskirkiri.vercel.app",
    siteName: "its.kirkiri",
    images: [
      {
        url: "/photo.jpeg",
        width: 800,
        height: 800,
        alt: "its.kirkiri Handcrafted Gifts"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "its.kirkiri | Handcrafted Gifts & Bouquets 🌸",
    description: "Add a little KIRKIRI in your life 💕 Handmade pipe-cleaner flowers, custom hampers & cute pouches from Lucknow.",
    images: ["/photo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdStoreSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "its.kirkiri",
  "image": "https://itskirkiri.vercel.app/photo.jpeg",
  "description": "Add a little KIRKIRI in your life. Mom & daughter handcrafted pipe-cleaner flower bouquets, custom hampers, cute pouches, and home decor pieces.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lucknow",
    "addressRegion": "Uttar Pradesh",
    "addressCountry": "IN"
  },
  "url": "https://itskirkiri.vercel.app",
  "telephone": "+918130422575",
  "priceRange": "₹"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStoreSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-charcoal">
        {children}
      </body>
    </html>
  );
}
