import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "its.kirkiri | Handmade Gifts, Bouquets & Custom Craft",
  description: "A cute pink-themed boutique for handmade bouquets, decorative items, purses, and custom order crafts, made with love.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-charcoal">
        {children}
      </body>
    </html>
  );
}
