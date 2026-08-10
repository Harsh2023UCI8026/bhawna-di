"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, Phone, Sparkles, CheckCircle, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCart, clearCart, CartItem } from "@/utils/storage";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Shipping details
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  
  // Payment option
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // States
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
    } else {
      setCartItems(items);
    }
  }, [router]);

  const copyUpiId = () => {
    navigator.clipboard.writeText("8130422575@okaxis");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!address.trim()) return setError("Please enter your address");
    if (!city.trim()) return setError("Please enter your city");
    if (!state.trim()) return setError("Please enter your state");
    if (!pincode.trim()) return setError("Please enter your pincode");
    if (!phone.trim()) return setError("Please enter your phone number");

    const checkoutPayload = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      landmark,
      paymentMethod,
      items: cartItems,
      totalAmount: grandTotal
    };

    // Send email notification via Resend API
    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload)
      });
    } catch (err) {
      console.error("Failed to send Resend checkout email:", err);
    }

    // Success actions
    setIsSuccess(true);
    clearCart();

    // Trigger full screen confetti celebration!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Fire secondary confetti burst after 1.5 seconds
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 1200);
  };

  // Calculations (re-calculated locally for safety)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryCharge = subtotal >= 1000 ? 0 : 60;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* Celebration Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#FDE2EC] rounded-3xl p-8 md:p-12 text-center shadow-lg max-w-2xl mx-auto space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-quicksand font-bold text-[#4A2C33]">
                Order Placed Successfully! 🎉
              </h2>
              
              <p className="text-sm md:text-base font-poppins text-[#4A2C33]/85 leading-relaxed max-w-md mx-auto">
                Yay, your order is on its way to being made with love! 🌸 Kirtika will personally craft your gifts and notify you shortly.
              </p>

              <div className="p-4 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]/70 text-left max-w-sm mx-auto space-y-1.5">
                <p><span className="font-semibold text-[#4A2C33]">Customer:</span> {name}</p>
                <p><span className="font-semibold text-[#4A2C33]">Address:</span> {address}, {landmark ? landmark + ", " : ""}{city}, {state} - {pincode}</p>
                <p><span className="font-semibold text-[#4A2C33]">Contact:</span> {phone}</p>
                <p><span className="font-semibold text-[#4A2C33]">Payment Method:</span> {paymentMethod === "COD" ? "Cash on Delivery" : "UPI Pay (Verification Pending)"}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-full shadow-md transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          ) : (
            /* Checkout Form Details */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form container (Col-span 2) */}
              <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
                
                {/* Shipping Details */}
                <div className="bg-white border border-[#FDE2EC] rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                  <h2 className="text-lg font-quicksand font-bold text-[#4A2C33] border-b border-[#FFF7FA] pb-3 flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-[#D6336C]" />
                    <span>Delivery Address</span>
                  </h2>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-poppins border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat/House No., Building Name, Street Address"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Nearby temple, hospital or school"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Enter state"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="813042XXXX"
                        className="w-full px-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Option */}
                <div className="bg-white border border-[#FDE2EC] rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                  <h2 className="text-lg font-quicksand font-bold text-[#4A2C33] border-b border-[#FFF7FA] pb-3 flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-[#D6336C]" />
                    <span>Payment Method</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-4 border rounded-2xl text-left font-poppins flex flex-col justify-between transition-all cursor-pointer ${
                        paymentMethod === "COD"
                          ? "bg-[#FDE2EC] border-[#F06292] ring-2 ring-[#F06292]/30"
                          : "bg-[#FFF7FA] border-[#FDE2EC] hover:bg-white"
                      }`}
                    >
                      <span className="font-semibold text-sm text-[#4A2C33]">Cash on Delivery</span>
                      <span className="text-[10px] text-[#4A2C33]/60 mt-1 leading-normal">
                        Pay cash directly to the courier agent when your pookie craft bouquet is delivered.
                      </span>
                    </button>

                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("UPI")}
                      className={`p-4 border rounded-2xl text-left font-poppins flex flex-col justify-between transition-all cursor-pointer ${
                        paymentMethod === "UPI"
                          ? "bg-[#FDE2EC] border-[#F06292] ring-2 ring-[#F06292]/30"
                          : "bg-[#FFF7FA] border-[#FDE2EC] hover:bg-white"
                      }`}
                    >
                      <span className="font-semibold text-sm text-[#4A2C33]">UPI / QR Scan</span>
                      <span className="text-[10px] text-[#4A2C33]/60 mt-1 leading-normal">
                        Scan our QR code or pay manually using our UPI address. Verifies instantly.
                      </span>
                    </button>
                  </div>

                  {/* UPI Details Dropdown */}
                  {paymentMethod === "UPI" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border border-[#FDE2EC] bg-[#FFF7FA] rounded-2xl p-4 flex flex-col items-center text-center space-y-3"
                    >
                      <p className="text-[10px] font-bold font-poppins uppercase tracking-wider text-[#D6336C]">
                        Scan to Pay with Any App
                      </p>
                      
                      {/* Simulated QR Code */}
                      <div className="w-36 h-36 bg-white border border-[#FDE2EC] p-3 rounded-2xl flex items-center justify-center relative">
                        {/* We use a mock QR code image generated visually */}
                        <div className="w-full h-full bg-[radial-gradient(#4a2c33_2px,transparent_2px)] [background-size:8px_8px] opacity-70 flex flex-col items-center justify-center">
                          <span className="bg-white px-2 py-1 text-[9px] font-bold text-[#D6336C] border border-[#FDE2EC] rounded-lg">
                            its.kirkiri
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 border border-[#FDE2EC] bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#4A2C33]">
                        <span>UPI: 8130422575@okaxis</span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="p-1 rounded hover:bg-[#FFF7FA] text-[#D6336C] cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {copiedUpi && (
                        <p className="text-[10px] font-poppins font-medium text-[#8BC34A]">
                          UPI ID copied! Paste in GPay/PhonePe 🎉
                        </p>
                      )}

                      <p className="text-[9px] font-poppins text-[#4A2C33]/50 italic">
                        Note: After scanner payment completes, place order. Kirtika will cross-verify with transaction logs.
                      </p>
                    </motion.div>
                  )}
                </div>
              </form>

              {/* Order Checkout Summary Panel (Col-span 1) */}
              <div className="space-y-6">
                <div className="bg-white border border-[#FDE2EC] rounded-3xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-quicksand font-bold text-[#4A2C33] border-b border-[#FFF7FA] pb-2">
                    Checkout Summary
                  </h2>

                  {/* List of items */}
                  <div className="max-h-48 overflow-y-auto space-y-3.5 pr-1">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center text-xs font-poppins">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#FDE2EC] shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-[#4A2C33] truncate">{item.product.name}</p>
                          <p className="text-[#4A2C33]/60 text-[10px]">
                            Qty: {item.quantity} {item.personalisation ? "• Custom" : ""}
                          </p>
                        </div>
                        <span className="font-bold text-[#D6336C] shrink-0">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#FFF7FA] pt-4 space-y-2 text-xs font-poppins text-[#4A2C33]/80">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#FFF7FA] pt-4 flex justify-between items-baseline">
                    <span className="font-quicksand font-bold text-sm text-[#4A2C33]">Grand Total</span>
                    <span className="text-lg font-bold font-quicksand text-[#D6336C]">₹{grandTotal}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Place Order (₹{grandTotal})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
