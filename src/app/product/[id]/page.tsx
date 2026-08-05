"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, ShoppingCart, Sparkles, MessageSquare, ArrowLeft, Plus, Minus, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCTS, Product } from "@/data/products";
import { 
  getCart, 
  addToCart, 
  getWishlist, 
  toggleWishlist, 
  getReviews, 
  addReview, 
  Review 
} from "@/utils/storage";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [personalisation, setPersonalisation] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [heartCount, setHeartCount] = useState(0);

  // Reviews States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewPhoto, setNewReviewPhoto] = useState<string | undefined>(undefined);
  const [photoFileName, setPhotoFileName] = useState("");
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (productId) {
      const prod = PRODUCTS.find((p) => p.id === productId);
      if (prod) {
        setProduct(prod);
        setActiveImage(prod.images[0]);
        setReviews(getReviews(productId));

        // Sync Wishlist State
        const wishlist = getWishlist();
        setIsLiked(wishlist.includes(productId));
      }
    }
  }, [productId]);

  // Sync wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (productId) {
        const wishlist = getWishlist();
        setIsLiked(wishlist.includes(productId));
      }
    };
    window.addEventListener("sakaar_wishlist_update", handleWishlistUpdate);
    return () => window.removeEventListener("sakaar_wishlist_update", handleWishlistUpdate);
  }, [productId]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-4xl">🌸</p>
          <h2 className="mt-4 text-xl font-quicksand font-bold text-[#4A2C33]">Product not found</h2>
          <button onClick={() => router.push("/")} className="mt-4 text-xs font-bold text-[#D6336C] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Related products (from same category, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleLikeToggle = () => {
    const liked = toggleWishlist(product.id);
    setIsLiked(liked);

    if (liked) {
      const newHearts = Array.from({ length: 5 }).map((_, i) => ({
        id: heartCount + i,
        x: (Math.random() - 0.5) * 60,
        y: -20 - Math.random() * 40,
      }));
      setHeartCount((c) => c + 5);
      setFloatingHearts((prev) => [...prev, ...newHearts]);
    }
  };

  const handleRemoveHeart = (id: number) => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, personalisation.trim() || undefined);
    showToast("Added to your bag! 🛍️");
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, personalisation.trim() || undefined);
    router.push("/cart");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Review Photo Handler
  const handleReviewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Review Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    addReview(product.id, newRating, newReviewText, newReviewName, newReviewPhoto);
    
    // Refresh reviews feed
    setReviews(getReviews(product.id));

    // Clear form
    setNewReviewText("");
    setNewReviewName("");
    setNewReviewPhoto(undefined);
    setPhotoFileName("");
    setIsWritingReview(false);
    showToast("Review submitted! Thank you 💕");
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : product.rating.toFixed(1);
  const totalReviews = reviews.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#4A2C33] text-[#FFF7FA] border border-[#FDE2EC] px-6 py-3 rounded-full text-xs font-poppins font-bold shadow-lg flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="text-xs font-bold font-quicksand text-[#4A2C33]/60 hover:text-[#D6336C] flex items-center gap-1 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white border border-[#FDE2EC] rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl overflow-hidden relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-[#FFF7FA] shrink-0 cursor-pointer ${
                      activeImage === img ? "border-[#D6336C]" : "border-[#FDE2EC]"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Specs */}
          <div className="flex flex-col">
            <div>
              <span className="text-[10px] font-bold font-poppins uppercase tracking-wider text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              
              <h1 className="text-2xl md:text-3xl font-quicksand font-bold text-[#4A2C33] mt-3">
                {product.name}
              </h1>

              {/* Rating summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold font-poppins text-[#4A2C33] ml-1">{averageRating}</span>
                </div>
                <span className="text-xs text-[#4A2C33]/40 font-poppins">•</span>
                <span className="text-xs text-[#4A2C33]/60 font-poppins hover:underline cursor-pointer flex items-center gap-0.5">
                  <MessageSquare className="w-3.5 h-3.5" /> {totalReviews} reviews
                </span>
              </div>
            </div>

            {/* Price tag */}
            <div className="mt-4 p-4 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl flex items-baseline gap-2">
              <span className="text-2xl font-bold font-quicksand text-[#D6336C]">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-[#4A2C33]/40 line-through font-poppins">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold font-poppins text-[#8BC34A]">
                    ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>

            <p className="text-xs md:text-sm font-poppins text-[#4A2C33]/80 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Customisation Note Box */}
            <div className="mt-5">
              <label className="block text-xs font-bold font-poppins text-[#4A2C33] mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D6336C]" />
                <span>Add Personalisation (Optional)</span>
              </label>
              <textarea
                value={personalisation}
                onChange={(e) => setPersonalisation(e.target.value)}
                placeholder="Examples: 'Write Happy Birthday Sia on card', 'Wrap in pink ribbon instead of red', 'Add white flower highlights'"
                className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 resize-none h-16"
              />
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold font-poppins text-[#4A2C33]">Quantity:</span>
              <div className="flex items-center border border-[#FDE2EC] bg-[#FFF7FA] rounded-full p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 rounded-full text-[#4A2C33]/60 hover:text-[#D6336C] hover:bg-white cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold font-poppins text-[#4A2C33]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 rounded-full text-[#4A2C33]/60 hover:text-[#D6336C] hover:bg-white cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cart & Like Actions */}
            <div className="mt-6 pt-6 border-t border-[#FFF7FA] flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 border border-[#D6336C] text-[#D6336C] hover:bg-[#FFF7FA] font-quicksand font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl text-center transition-all cursor-pointer shadow-md"
              >
                Buy Now
              </button>

              {/* Heart Wishlist Trigger */}
              <button
                onClick={handleLikeToggle}
                className="p-3 border border-[#FDE2EC] hover:bg-[#FFF7FA] rounded-2xl text-[#4A2C33]/60 hover:text-[#D6336C] relative cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-[#D6336C] text-[#D6336C]" : ""}`} />
                
                {/* Floating Heart Burst */}
                <AnimatePresence>
                  {floatingHearts.map((heart) => (
                    <motion.span
                      key={heart.id}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 0, scale: 0.8, x: heart.x, y: heart.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      onAnimationComplete={() => handleRemoveHeart(heart.id)}
                      className="absolute pointer-events-none text-xs -top-1 left-4"
                    >
                      💖
                    </motion.span>
                  ))}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-8 bg-white border border-[#FDE2EC] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#FFF7FA] pb-4 gap-4">
            <div>
              <h2 className="text-lg font-quicksand font-bold text-[#4A2C33] flex items-center gap-1.5">
                Customer Reviews <span className="text-pink-500">✨</span>
              </h2>
              <p className="text-xs font-poppins text-[#4A2C33]/60">
                What clients say about this gift
              </p>
            </div>
            
            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="px-4 py-2 bg-[#FFF7FA] hover:bg-[#FDE2EC] text-[#D6336C] border border-[#FDE2EC] rounded-2xl text-xs font-bold font-quicksand transition-colors cursor-pointer"
            >
              {isWritingReview ? "Cancel Review" : "Write a Review"}
            </button>
          </div>

          {/* Write a Review Form */}
          <AnimatePresence>
            {isWritingReview && (
              <motion.form
                onSubmit={handleReviewSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4 p-4 border border-[#FDE2EC] bg-[#FFF7FA] rounded-2xl space-y-3"
              >
                <h3 className="text-xs font-bold font-poppins text-[#4A2C33]">
                  Submit Your Review
                </h3>
                
                {/* Rating Input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold font-poppins text-[#4A2C33]/70">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-0.5 text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-[#4A2C33]/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Riya Sharma"
                      className="w-full px-3 py-1.5 bg-white border border-[#FDE2EC] rounded-xl text-xs font-poppins text-[#4A2C33]"
                    />
                  </div>
                  
                  {/* Photo upload */}
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-[#4A2C33]/60 mb-1">
                      Add Photo (Optional)
                    </label>
                    <div className="relative border border-dashed border-[#FDE2EC] bg-white rounded-xl px-3 py-1 text-center flex items-center justify-center gap-1.5 cursor-pointer group hover:bg-[#FFF7FA]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReviewPhotoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Camera className="w-3.5 h-3.5 text-[#D6336C]" />
                      <span className="text-[10px] font-semibold font-poppins text-[#4A2C33]/60 truncate max-w-[120px]">
                        {photoFileName || "Attach Image"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-poppins text-[#4A2C33]/60 mb-1">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Write details about the size, ribbon wrapper, or look of the product..."
                    className="w-full px-3 py-2 bg-white border border-[#FDE2EC] rounded-xl text-xs font-poppins text-[#4A2C33]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Submit Review
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews Feed */}
          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 border-b border-[#FFF7FA] last:border-b-0 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="font-semibold font-poppins text-[#4A2C33] flex items-center gap-1.5">
                      <span>{rev.userName}</span>
                      <span className="text-[10px] text-[#8BC34A] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Verified Purchase</span>
                    </div>
                    <span className="text-[#4A2C33]/40 font-poppins">{rev.date}</span>
                  </div>

                  {/* Stars display */}
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-current" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs font-poppins text-[#4A2C33]/80 leading-relaxed">
                    {rev.text}
                  </p>

                  {/* Review Photo Attachment */}
                  {rev.photo && (
                    <div className="mt-2">
                      <img
                        src={rev.photo}
                        alt="customer receipt"
                        className="w-16 h-16 object-cover rounded-xl border border-[#FDE2EC] hover:scale-105 transition-transform cursor-zoom-in"
                        onClick={() => {
                          const w = window.open();
                          w?.document.write(`<img src="${rev.photo}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs font-poppins text-[#4A2C33]/40 text-center py-6">
                No reviews yet. Be the first to leave a review! 🌸
              </p>
            )}
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-quicksand font-bold text-[#4A2C33] mb-6 flex items-center gap-1">
              You May Also Like <Sparkles className="w-4 h-4 text-[#D6336C] animate-pulse" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
