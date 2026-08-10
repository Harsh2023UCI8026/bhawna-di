"use client";

import Link from "next/link";
import { Phone, Heart, Sparkles, ShoppingBag } from "lucide-react";

// Inline Instagram SVG Icon to avoid Lucide-react import issues
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#FDE2EC] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Founder Note */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-1.5">
              <img
                src="/photo.jpeg"
                alt="its.kirkiri"
                className="w-6 h-6 rounded-full object-cover border border-[#F06292]/50"
              />
              <span className="font-quicksand font-bold text-xl text-[#D6336C]">
                its.kirkiri
              </span>
              <span className="text-pink-500 text-sm">💕</span>
            </Link>
            
            <p className="text-xs md:text-sm font-poppins text-[#4A2C33]/80 leading-relaxed max-w-sm">
              &quot;Hi, I&apos;m Kirtika 💕 I put so much love and effort into every piece on its.kirkiri — if you enjoyed shopping here, please show us some love and support!&quot;
            </p>

            <div className="flex items-center gap-4 text-xs font-poppins text-[#4A2C33]/70 pt-2">
              <a
                href="https://instagram.com/its.kirkiri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#D6336C] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#D6336C]" />
                <span>@its.kirkiri</span>
              </a>
              <a
                href="tel:8130422575"
                className="flex items-center gap-1.5 hover:text-[#D6336C] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D6336C]" />
                <span>8130422575</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-quicksand font-bold text-sm text-[#4A2C33] tracking-wide uppercase">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs font-poppins text-[#4A2C33]/70">
              <li>
                <Link href="/#bouquets-flowers" className="hover:text-[#D6336C] transition-colors">
                  Bouquets & Flowers
                </Link>
              </li>
              <li>
                <Link href="/#decor" className="hover:text-[#D6336C] transition-colors">
                  Decorative Items
                </Link>
              </li>
              <li>
                <Link href="/#purses-bags" className="hover:text-[#D6336C] transition-colors">
                  Purses & Pouches
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-[#D6336C] transition-colors flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-[#D6336C]" />
                  <span>Custom Orders</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Owner Info & Developer Credits */}
          <div className="space-y-3">
            <h3 className="font-quicksand font-bold text-sm text-[#4A2C33] tracking-wide uppercase">
              Contact & Support
            </h3>
            <div className="space-y-2 text-xs font-poppins text-[#4A2C33]/70">
              <p>
                <span className="font-semibold">Owner:</span> Kirtika
              </p>
              <p>
                <span className="font-semibold">Helpline:</span> 8130422575
              </p>
              <div className="border-t border-[#FDE2EC] pt-3 mt-3">
                <p className="text-[11px] leading-relaxed italic text-[#4A2C33]/60">
                  Website designed & developed by{" "}
                  <a
                    href="tel:7042834496"
                    className="font-semibold text-[#D6336C] hover:underline"
                  >
                    Harsh Jha (7042834496)
                  </a>
                  . Want a website like this? Get in touch!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FDE2EC] mt-8 pt-6 text-center text-[10px] font-poppins text-[#4A2C33]/50">
          <p>© {new Date().getFullYear()} its.kirkiri. Made with love and pipe-cleaners 🌸</p>
        </div>
      </div>
    </footer>
  );
}
