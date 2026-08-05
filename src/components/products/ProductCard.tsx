"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { getWishlist, toggleWishlist } from "@/utils/storage";

interface ProductCardProps {
  product: Product;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [heartCounter, setHeartCounter] = useState(0);

  useEffect(() => {
    const wishlist = getWishlist();
    setIsLiked(wishlist.includes(product.id));

    const handleWishlistUpdate = () => {
      const updatedWishlist = getWishlist();
      setIsLiked(updatedWishlist.includes(product.id));
    };
    window.addEventListener("sakaar_wishlist_update", handleWishlistUpdate);
    return () => window.removeEventListener("sakaar_wishlist_update", handleWishlistUpdate);
  }, [product.id]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking heart
    e.stopPropagation();

    const liked = toggleWishlist(product.id);
    setIsLiked(liked);

    if (liked) {
      // Spawn 5 floating hearts for cute micro-animation
      const newHearts = Array.from({ length: 6 }).map((_, i) => ({
        id: heartCounter + i,
        x: (Math.random() - 0.5) * 50, // spread horizontally
        y: -10 - Math.random() * 40,   // float up
        scale: 0.5 + Math.random() * 0.8
      }));
      setHeartCounter(prev => prev + 6);
      setFloatingHearts(prev => [...prev, ...newHearts]);
    }
  };

  // Clean up floating hearts after they finish animating
  const removeHeart = (id: number) => {
    setFloatingHearts(prev => prev.filter(h => h.id !== id));
  };

  // Calculate discount percentage
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white border border-[#FDE2EC] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
    >
      {/* Product Image Link */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-[#FFF7FA] shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#D6336C] text-white font-quicksand font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Heart / Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleLikeClick}
            className="p-2 bg-white/80 hover:bg-white border border-[#FDE2EC] rounded-full shadow-sm text-[#4A2C33]/60 hover:text-[#D6336C] transition-colors relative cursor-pointer"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#D6336C] text-[#D6336C]" : ""}`} />
            </motion.div>

            {/* Floating Heart Elements */}
            <AnimatePresence>
              {floatingHearts.map((heart) => (
                <motion.span
                  key={heart.id}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: heart.scale, 
                    x: heart.x, 
                    y: heart.y 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onAnimationComplete={() => removeHeart(heart.id)}
                  className="absolute pointer-events-none text-xs text-[#D6336C] -top-1 left-3.5"
                >
                  ❤️
                </motion.span>
              ))}
            </AnimatePresence>
          </button>
        </div>
      </Link>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="block flex-1">
          <span className="text-[10px] font-bold font-poppins uppercase tracking-wider text-[#D6336C]/80 bg-[#FFF7FA] border border-[#FDE2EC] px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <h3 className="mt-2 text-sm font-semibold font-poppins text-[#4A2C33] group-hover:text-[#D6336C] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Pricing & Cart Button */}
        <div className="mt-3 pt-3 border-t border-[#FFF7FA] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-quicksand text-[#D6336C]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#4A2C33]/40 line-through font-poppins">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <Link
            href={`/product/${product.id}`}
            className="text-xs font-bold font-quicksand text-[#D6336C] hover:text-[#C2185B] bg-[#FFF7FA] hover:bg-[#FDE2EC] border border-[#FDE2EC] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            View Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
