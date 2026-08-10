"use client";

import { useState } from "react";
import { Sparkles, Phone, Upload, Calendar, IndianRupee, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { addCustomOrder } from "@/utils/storage";

export default function CustomOrderPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState("");
  
  // Statuses
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!phone.trim()) return setError("Please enter your contact number");
    if (!description.trim()) return setError("Please describe what you want made");

    // Add to localStorage
    addCustomOrder({
      name,
      phone,
      email: email || undefined,
      description,
      image: base64Image,
      budget: budget || undefined,
      deliveryDate: deliveryDate || undefined
    });

    setIsSubmitted(true);
    
    // Clear forms
    setName("");
    setPhone("");
    setEmail("");
    setDescription("");
    setBudget("");
    setDeliveryDate("");
    setBase64Image(undefined);
    setFileName("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF7FA]">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Header Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDE2EC] text-[#D6336C] text-xs font-semibold font-poppins mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Made-to-Order</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-quicksand font-bold text-[#4A2C33]">
            Request a Custom Design 🎨
          </h1>
          <p className="text-xs md:text-sm font-poppins text-[#4A2C33]/70 mt-2 max-w-lg mx-auto">
            Have a specific vision in mind? Tell us what you want to create, upload reference photos, and our team will get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form (Col-span 2) */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-[#FDE2EC] rounded-3xl p-8 text-center shadow-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                    className="inline-block text-5xl mb-4"
                  >
                    💖
                  </motion.div>
                  <h3 className="text-xl font-quicksand font-bold text-[#4A2C33]">
                    Request Received!
                  </h3>
                  <p className="mt-3 text-xs md:text-sm font-poppins text-[#4A2C33]/85 leading-relaxed">
                    Your custom request has been saved. Kirtika will review your reference files and call you soon at your contact number!
                  </p>
                  
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-xs rounded-full shadow transition-all cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-[#FDE2EC] rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
                >
                  <h2 className="text-lg font-quicksand font-bold text-[#4A2C33] border-b border-[#FFF7FA] pb-3 mb-2">
                    Share your requirements
                  </h2>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-poppins border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Contact Number * (For call/WhatsApp)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="813042XXXX"
                        className="w-full px-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                      Email ID (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                      Tell us what you&apos;d like made *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe colors, flower counts, size, or themes (e.g. 'I want a bouquet of 12 lavender pipe cleaner roses with pink wrappers for a birthday party')"
                      className="w-full px-4 py-3 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Budget Range (Optional)
                      </label>
                      <div className="relative">
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]/80 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 appearance-none cursor-pointer"
                        >
                          <option value="">Select range</option>
                          <option value="Under ₹500">Under ₹500</option>
                          <option value="₹500 - ₹1000">₹500 - ₹1,000</option>
                          <option value="₹1000 - ₹2000">₹1,000 - ₹2,000</option>
                          <option value="Above ₹2000">Above ₹2,000</option>
                        </select>
                        <IndianRupee className="w-3.5 h-3.5 text-[#4A2C33]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                        Preferred Delivery Date (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-xs font-poppins text-[#4A2C33]/80 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 cursor-pointer"
                        />
                        <Calendar className="w-3.5 h-3.5 text-[#4A2C33]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                      Reference Image/Video (Optional)
                    </label>
                    <div className="border border-dashed border-[#FDE2EC] bg-[#FFF7FA] rounded-2xl p-4 text-center hover:bg-white transition-colors relative cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                        <Upload className="w-6 h-6 text-[#D6336C] group-hover:scale-105 transition-transform" />
                        <p className="text-xs font-semibold font-poppins text-[#4A2C33]/70">
                          {fileName || "Click to upload reference file"}
                        </p>
                        <p className="text-[9px] font-poppins text-[#4A2C33]/40">
                          Supports PNG, JPG, or small MP4 files
                        </p>
                      </div>
                    </div>
                    {base64Image && (
                      <div className="mt-3">
                        <p className="text-[10px] font-semibold font-poppins text-[#4A2C33]/50 mb-1">
                          Preview:
                        </p>
                        <img
                          src={base64Image}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-xl border border-[#FDE2EC]"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] mt-4 cursor-pointer"
                  >
                    Submit Custom Request
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info Banner (Col-span 1) */}
          <div className="space-y-6">
            {/* Call Now Card */}
            <div className="bg-gradient-to-br from-[#D6336C] to-[#C2185B] text-white rounded-3xl p-6 shadow-md text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-white/20">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-quicksand font-bold text-lg">
                Prefer to talk? 📞
              </h3>
              <p className="text-xs font-poppins text-white/90 leading-relaxed">
                Explain your requirements directly to the designer! Tap the button below to call founder Kirtika.
              </p>
              
              <a
                href="tel:8130422575"
                className="block w-full py-2.5 bg-white text-[#D6336C] hover:bg-[#FFF7FA] font-quicksand font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Call Now: 8130422575
              </a>
            </div>

            {/* How It Works Card */}
            <div className="bg-white border border-[#FDE2EC] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-quicksand font-bold text-sm text-[#4A2C33] border-b border-[#FFF7FA] pb-2">
                How it works 🌸
              </h3>
              <ul className="space-y-3.5 text-xs font-poppins text-[#4A2C33]/80">
                <li className="flex gap-2">
                  <span className="font-bold text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Fill this form with details and attach reference images.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Kirtika reviews the draft design and materials needed.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>We call you on your contact number to discuss feasibility, price quote, and timeline.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <span>Once confirmed, your order is crafted with love and shipped!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
