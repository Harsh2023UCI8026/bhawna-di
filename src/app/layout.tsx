import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sakaar.art | Handmade Gifts, Bouquets & Custom Craft",
  description: "A cute pink-themed boutique for handmade bouquets, decorative items, purses, and custom order crafts, made with love.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-bg text-charcoal">
        {children}
      </body>
    </html>
  );
}
