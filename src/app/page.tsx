"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Flower, Gift, Home, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/common/SplashScreen";
import ProductCard from "@/components/products/ProductCard";
import { CATEGORIES, PRODUCTS, Product } from "@/data/products";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);

  // Filter products when category or sub-category changes
  useEffect(() => {
    let result = PRODUCTS;
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedSubCategory) {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubCategory]);

  const handleCategorySelect = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      // Toggle off
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(categoryName);
      setSelectedSubCategory(null); // Reset sub-category
    }
  };

  const getSubCategories = () => {
    if (!selectedCategory) return [];
    const catObj = CATEGORIES.find(c => c.name === selectedCategory);
    return catObj ? catObj.subCategories : [];
  };

  return (
    <>
      {/* Animated Welcome Splash */}
      <SplashScreen />

      <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FDE2EC]/40 to-[#FFF7FA] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          {/* Decorative shapes */}
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#FDE2EC] blur-2xl opacity-60 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#F06292]/10 blur-3xl opacity-50" />

          <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
            {/* Circular Profile Photo at Starting Top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6 group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F06292] to-[#D6336C] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img
                src="/photo.jpeg"
                alt="its.kirkiri Profile"
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FDE2EC] border border-[#F06292]/20 text-[#D6336C] text-xs font-semibold font-poppins mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>100% Handcrafted with Love</span>
            </motion.div>

            {/* Homepage Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-quicksand font-bold text-[#4A2C33] tracking-tight leading-tight"
            >
              its.kirkiri <span className="text-[#D6336C]">💖</span>
            </motion.h1>

            {/* Bio Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#FDE2EC] rounded-3xl shadow-sm max-w-lg w-full text-center space-y-2 font-poppins text-xs sm:text-sm text-[#4A2C33] overflow-hidden"
            >
              <p className="font-semibold text-[#D6336C]">Add a little KIRKIRI in your life 💖</p>
              <p className="text-[#4A2C33]/80">Mom & daughter behind the magic🪄</p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 pt-1">
                <a
                  href="https://instagram.com/mamta.t_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#FFF7FA] border border-[#FDE2EC] rounded-full text-[#D6336C] font-semibold hover:bg-[#FDE2EC] transition-all text-xs flex items-center gap-1"
                >
                  <span>@mamta.t_</span>
                </a>
                <a
                  href="https://instagram.com/_kirti.t_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#FFF7FA] border border-[#FDE2EC] rounded-full text-[#D6336C] font-semibold hover:bg-[#FDE2EC] transition-all text-xs flex items-center gap-1"
                >
                  <span>@_kirti.t_</span>
                </a>
                <a
                  href="https://instagram.com/its.kirkiri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#D6336C] text-white rounded-full font-semibold hover:bg-[#C2185B] transition-all text-xs flex items-center gap-1"
                >
                  <span>@its.kirkiri</span>
                </a>
              </div>

              <p className="pt-1 text-[#4A2C33]/80">DM for orders & custom creations 💌</p>
              <p className="font-medium text-[#4A2C33]/90">📍Lucknow based</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-xs md:text-sm font-poppins text-[#4A2C33]/70 leading-relaxed max-w-xl mx-auto"
            >
              Explore our handmade pipe-cleaner flower bouquets, custom hampers, cute pouches, and home decor pieces made by Kirtika.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <a
                href="#collection"
                className="w-full sm:w-auto px-8 py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/custom-order"
                className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-[#FFF7FA] border border-[#FDE2EC] text-[#D6336C] font-quicksand font-bold text-sm rounded-full shadow-sm hover:shadow transition-all text-center cursor-pointer"
              >
                Request Custom Design
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-quicksand font-bold text-[#4A2C33] flex items-center justify-center gap-1.5">
              Browse Categories <span className="text-[#D6336C]">🌸</span>
            </h2>
            <p className="text-xs font-poppins text-[#4A2C33]/60 mt-1">
              Select a category to filter our handmade catalog
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`group text-left border rounded-3xl p-3 flex flex-col items-center justify-center text-center transition-all aspect-[4/3] relative overflow-hidden shadow-sm hover:shadow cursor-pointer ${
                    isActive 
                      ? "bg-[#FDE2EC] border-[#F06292] ring-2 ring-[#F06292]/30" 
                      : "bg-white border-[#FDE2EC] hover:border-[#F06292]/55"
                  }`}
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-12 h-12 rounded-full object-cover border border-[#FDE2EC] mb-2 group-hover:scale-105 transition-transform" 
                  />
                  <span className="font-quicksand font-bold text-xs text-[#4A2C33] line-clamp-1">
                    {cat.name}
                  </span>
                  {isActive && (
                    <div className="absolute top-2 right-2 text-xs bg-[#D6336C] text-white p-0.5 rounded-full">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-category pills */}
          {selectedCategory && (
            <div className="mt-6 p-4 bg-white border border-[#FDE2EC] rounded-3xl shadow-sm">
              <p className="text-xs font-semibold font-poppins text-[#4A2C33]/60 mb-2">
                Filter by Type:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-poppins font-medium transition-all cursor-pointer ${
                    !selectedSubCategory
                      ? "bg-[#D6336C] text-white"
                      : "bg-[#FFF7FA] text-[#4A2C33]/70 hover:bg-[#FDE2EC]/40"
                  }`}
                >
                  All {selectedCategory}
                </button>
                {getSubCategories().map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub === selectedSubCategory ? null : sub)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-poppins font-medium transition-all cursor-pointer ${
                      sub === selectedSubCategory
                        ? "bg-[#D6336C] text-white"
                        : "bg-[#FFF7FA] text-[#4A2C33]/70 hover:bg-[#FDE2EC]/40"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Custom Order CTA Banner */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full my-6">
          <div className="bg-gradient-to-r from-[#FDE2EC] via-[#FFF7FA] to-[#FDE2EC] border border-[#F06292]/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#F06292]/10 translate-x-8 -translate-y-8" />
            
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg md:text-xl font-quicksand font-bold text-[#4A2C33] flex items-center justify-center md:justify-start gap-1">
                Want a custom creation? <Sparkles className="w-4 h-4 text-[#D6336C] animate-pulse" />
              </h3>
              <p className="text-xs md:text-sm font-poppins text-[#4A2C33]/70 max-w-lg">
                Tell us your colors, ribbons, flowers, or custom gifts. Founder Kirtika will personally design and craft them for you!
              </p>
            </div>
            
            <Link
              href="/custom-order"
              className="px-6 py-2.5 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-full shadow-md transition-all shrink-0 cursor-pointer"
            >
              Get Custom Quote
            </Link>
          </div>
        </section>

        {/* Products Collection Grid */}
        <section id="collection" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-quicksand font-bold text-[#4A2C33] flex items-center gap-1.5 justify-center sm:justify-start">
                Our Craft Collection <span className="text-[#D6336C]">✨</span>
              </h2>
              <p className="text-xs font-poppins text-[#4A2C33]/60 mt-1">
                {selectedCategory ? `${selectedCategory} Collection` : "Handmade treasures waiting for you"}
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="text-xs font-bold font-quicksand text-[#D6336C] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#FDE2EC] rounded-3xl py-16 px-4 text-center max-w-md mx-auto shadow-sm">
              <div className="text-4xl">🌸</div>
              <h3 className="mt-4 text-lg font-bold font-quicksand text-[#4A2C33]">
                No crafts found
              </h3>
              <p className="mt-2 text-xs font-poppins text-[#4A2C33]/60 leading-relaxed">
                We don&apos;t have any products in this specific filter right now. Try clearing filters or request a Custom Order!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="mt-6 px-5 py-2 bg-[#D6336C] text-white font-quicksand font-bold text-xs rounded-full shadow cursor-pointer"
              >
                Show All Crafts
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
