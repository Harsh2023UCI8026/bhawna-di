"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, Ticket, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  CartItem 
} from "@/utils/storage";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0); // in percentage
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();

    // Listen for cart changes
    window.addEventListener("sakaar_cart_update", loadCart);
    return () => window.removeEventListener("sakaar_cart_update", loadCart);
  }, []);

  const handleQtyChange = (productId: string, quantity: number, personalisation?: string) => {
    updateCartQuantity(productId, quantity, personalisation);
  };

  const handleRemove = (productId: string, personalisation?: string) => {
    removeFromCart(productId, personalisation);
  };

  const applyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();

    if (code === "POOKIE") {
      setDiscountApplied(10);
      setPromoSuccess("Promo code 'POOKIE' applied! 10% discount added 💕");
    } else if (code === "HEART") {
      setDiscountApplied(15);
      setPromoSuccess("Promo code 'HEART' applied! 15% discount added ❤️");
    } else {
      setPromoError("Invalid code! Try 'POOKIE' or 'HEART'");
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountApplied) / 100);
  const deliveryCharge = subtotal >= 1000 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal - discountAmount + deliveryCharge;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-quicksand font-bold text-[#4A2C33] mb-8 flex items-center gap-1.5 justify-center md:justify-start">
          Your Shopping Bag <ShoppingBag className="w-6 h-6 text-[#D6336C]" />
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List (Col-span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={`${item.product.id}-${item.personalisation || idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white border border-[#FDE2EC] rounded-3xl p-4 flex gap-4 items-center shadow-sm relative"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-[#FDE2EC]"
                    />

                    {/* Content Details */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-poppins font-semibold text-sm text-[#4A2C33] truncate">
                        {item.product.name}
                      </h3>
                      
                      {item.personalisation && (
                        <p className="text-[10px] font-poppins text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] px-2 py-0.5 rounded-lg inline-block mt-1 leading-normal max-w-full truncate">
                          ✏️ Note: {item.personalisation}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2">
                        {/* Price */}
                        <span className="text-sm font-bold font-quicksand text-[#D6336C]">
                          ₹{item.product.price}
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center border border-[#FDE2EC] bg-[#FFF7FA] rounded-full p-0.5">
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.quantity - 1, item.personalisation)}
                            className="p-1 rounded-full text-[#4A2C33]/60 hover:text-[#D6336C] hover:bg-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-poppins text-[#4A2C33]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.quantity + 1, item.personalisation)}
                            className="p-1 rounded-full text-[#4A2C33]/60 hover:text-[#D6336C] hover:bg-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => handleRemove(item.product.id, item.personalisation)}
                      className="p-2 rounded-full text-[#4A2C33]/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold font-quicksand text-[#D6336C] hover:underline pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Price Calculations Summary (Col-span 1) */}
            <div className="space-y-6">
              {/* Promo Code Card */}
              <div className="bg-white border border-[#FDE2EC] rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="font-quicksand font-bold text-xs text-[#4A2C33] tracking-wide uppercase flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-[#D6336C]" />
                  <span>Apply Promo Code</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter POOKIE or HEART"
                    className="flex-1 px-3 py-1.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-xl text-xs font-poppins uppercase placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-1.5 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] font-poppins text-red-500">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] font-poppins text-[#8BC34A] font-medium">{promoSuccess}</p>}
              </div>

              {/* Order Invoice Details Card */}
              <div className="bg-white border border-[#FDE2EC] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-quicksand font-bold text-sm text-[#4A2C33] border-b border-[#FFF7FA] pb-2">
                  Order Invoice Summary
                </h3>

                <div className="space-y-2 text-xs font-poppins text-[#4A2C33]/80">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  {discountApplied > 0 && (
                    <div className="flex justify-between text-[#8BC34A] font-semibold">
                      <span>Promo Discount ({discountApplied}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-[#8BC34A] font-semibold">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  {deliveryCharge > 0 && (
                    <p className="text-[9px] text-[#4A2C33]/50 italic">
                      Add ₹{1000 - subtotal} more of crafts for FREE delivery!
                    </p>
                  )}
                </div>

                <div className="border-t border-[#FFF7FA] pt-4 flex justify-between items-baseline">
                  <span className="font-quicksand font-bold text-sm text-[#4A2C33]">Grand Total</span>
                  <span className="text-xl font-bold font-quicksand text-[#D6336C]">₹{grandTotal}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#FDE2EC] rounded-3xl py-16 px-4 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="text-5xl">🛍️</div>
            <h3 className="text-lg font-bold font-quicksand text-[#4A2C33]">
              Your bag is empty!
            </h3>
            <p className="text-xs font-poppins text-[#4A2C33]/60 max-w-xs mx-auto leading-relaxed">
              Looks like you haven&apos;t added any beautiful bouquets or handcrafted custom orders to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-full shadow transition-all cursor-pointer"
            >
              Shop Handcrafts
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
