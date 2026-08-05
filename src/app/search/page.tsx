"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCTS, Product } from "@/data/products";

function InnerSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") || "";

  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      const q = query.toLowerCase().trim();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Back Link */}
        <button
          onClick={() => router.push("/")}
          className="text-xs font-bold font-quicksand text-[#4A2C33]/60 hover:text-[#D6336C] flex items-center gap-1 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-quicksand font-bold text-[#4A2C33]">
            Search Results for <span className="text-[#D6336C]">{query}</span>
          </h1>
          <p className="text-xs font-poppins text-[#4A2C33]/60 mt-1">
            Found {results.length} matching craft options
          </p>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#FDE2EC] rounded-3xl py-16 px-4 text-center max-w-md mx-auto shadow-sm">
            <div className="text-4xl">🌸</div>
            <h3 className="mt-4 text-lg font-bold font-quicksand text-[#4A2C33]">
              No results found
            </h3>
            <p className="mt-2 text-xs font-poppins text-[#4A2C33]/60 leading-relaxed">
              We couldn&apos;t find any items matching &quot;{query}&quot;. Try checking for typos, searching other tags (e.g. bouquet, pouch, candle), or check our categories!
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-5 py-2.5 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-full shadow transition-all cursor-pointer"
            >
              Browse Categories
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <InnerSearch />
    </Suspense>
  );
}
