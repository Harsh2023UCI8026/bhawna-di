"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCTS, Product } from "@/data/products";
import { getWishlist, toggleWishlist, addToCart } from "@/utils/storage";

export default function WishlistPage() {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);

  const loadWishlist = () => {
    const wishIds = getWishlist();
    const items = PRODUCTS.filter((p) => wishIds.includes(p.id));
    setLikedProducts(items);
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("sakaar_wishlist_update", loadWishlist);
    return () => window.removeEventListener("sakaar_wishlist_update", loadWishlist);
  }, []);

  const handleRemoveFromWishlist = (productId: string) => {
    toggleWishlist(productId);
    loadWishlist();
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedSuccess(product.id);
    setTimeout(() => setAddedSuccess(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold font-quicksand text-[#4A2C33]/70 hover:text-[#D6336C] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#FDE2EC]">
          <div>
            <h1 className="text-2xl md:text-3xl font-quicksand font-bold text-[#4A2C33] flex items-center gap-2">
              My Wishlist <Heart className="w-6 h-6 text-[#D6336C] fill-[#D6336C]" />
            </h1>
            <p className="text-xs font-poppins text-[#4A2C33]/60 mt-1">
              {likedProducts.length > 0
                ? `${likedProducts.length} saved pookie favorites`
                : "Your saved craft favorites"}
            </p>
          </div>

          {likedProducts.length > 0 && (
            <Link
              href="/#collection"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-full text-xs font-bold font-quicksand text-[#D6336C] hover:bg-[#FDE2EC] transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore More Items</span>
            </Link>
          )}
        </div>

        {/* Wishlist Grid or Empty State */}
        {likedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {likedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <ProductCard product={product} />

                  {/* Add to Cart Action */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 py-2 px-3 rounded-2xl text-xs font-quicksand font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                        addedSuccess === product.id
                          ? "bg-emerald-500 text-white"
                          : "bg-[#D6336C] hover:bg-[#C2185B] text-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {addedSuccess === product.id ? "Added to Cart! 🎉" : "Add to Cart"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      title="Remove from wishlist"
                      className="p-2 bg-white border border-[#FDE2EC] hover:border-red-200 text-[#4A2C33]/60 hover:text-red-500 rounded-2xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white border border-[#FDE2EC] rounded-3xl py-16 px-6 text-center max-w-md mx-auto shadow-sm my-8 space-y-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block text-5xl"
            >
              💖
            </motion.div>

            <h3 className="text-xl font-bold font-quicksand text-[#4A2C33]">
              Your Wishlist is Empty
            </h3>

            <p className="text-xs font-poppins text-[#4A2C33]/70 leading-relaxed max-w-xs mx-auto">
              You haven&apos;t liked any items yet! Tap the heart icon on any bouquet, hamper, or pouch to save your favorites here.
            </p>

            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
            >
              Discover Handcrafted Gifts
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
