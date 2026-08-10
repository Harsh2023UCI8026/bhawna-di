"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, User, LogOut, X, Sparkles } from "lucide-react";
import { getCart, getWishlist, getLoggedInUser, logoutUser, User as StorageUser } from "@/utils/storage";
import { PRODUCTS } from "@/data/products";
import AuthModal from "../auth/AuthModal";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Storage states
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<StorageUser | null>(null);
  
  // Modals / Dropdowns
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const searchRef = useRef<HTMLFormElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const updateNavbarStates = () => {
    // Cart Count
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    // Wishlist Count
    const wish = getWishlist();
    setWishlistCount(wish.length);

    // User State
    setUser(getLoggedInUser());
  };

  useEffect(() => {
    updateNavbarStates();

    // Listen to custom local storage events
    window.addEventListener("sakaar_cart_update", updateNavbarStates);
    window.addEventListener("sakaar_wishlist_update", updateNavbarStates);
    window.addEventListener("sakaar_auth_update", updateNavbarStates);

    // Click outside handlers
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("sakaar_cart_update", updateNavbarStates);
      window.removeEventListener("sakaar_wishlist_update", updateNavbarStates);
      window.removeEventListener("sakaar_auth_update", updateNavbarStates);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Search input change
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      ).slice(0, 5); // Limit suggestions to 5
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setSearchQuery("");
    setShowSuggestions(false);
    router.push(`/product/${productId}`);
  };

  const handleLogout = () => {
    logoutUser();
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 border-b border-[#FDE2EC] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-16 flex items-center justify-between gap-1 sm:gap-4 overflow-hidden w-full">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group min-w-0">
            <img
              src="/photo.jpeg"
              alt="its.kirkiri"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#F06292]/50 group-hover:scale-105 transition-transform"
            />
            <span className="font-quicksand font-bold text-lg sm:text-xl md:text-2xl text-[#D6336C] tracking-tight group-hover:scale-[1.02] transition-transform truncate">
              its.kirkiri
            </span>
            <span className="text-pink-500 animate-pulse text-sm sm:text-base">💕</span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            ref={searchRef}
            className="flex-1 max-w-md relative hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                placeholder="Search flowers, bouquets, bags..."
                className="w-full pl-10 pr-10 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-full text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
              />
              <Search className="w-4 h-4 text-[#4A2C33]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A2C33]/50 hover:text-[#D6336C] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Auto-complete Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#FDE2EC] rounded-2xl shadow-lg overflow-hidden z-50">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSuggestionClick(p.id)}
                      className="w-full px-4 py-2.5 text-left text-sm font-poppins text-[#4A2C33] hover:bg-[#FFF7FA] border-b border-[#FFF7FA] last:border-b-0 flex items-center gap-3 cursor-pointer"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-xs text-[#D6336C] font-semibold">₹{p.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-xs font-poppins text-[#4A2C33]/50">
                    No exact match. Press Enter to search all tags 🌸
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right Navigation & Icons */}
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Custom Orders Link */}
            <Link
              href="/custom-order"
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold font-quicksand text-[#D6336C] bg-[#FFF7FA] border border-[#FDE2EC] rounded-full hover:bg-[#FDE2EC] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Custom Order</span>
              <span className="sm:hidden">Custom</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#FFF7FA] text-[#4A2C33]/70 hover:text-[#D6336C] relative transition-colors cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#D6336C] text-[9px] font-bold text-white flex items-center justify-center scale-95">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#FFF7FA] text-[#4A2C33]/70 hover:text-[#D6336C] relative transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#D6336C] text-[9px] font-bold text-white flex items-center justify-center scale-95">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Login/Profile */}
            <div ref={profileRef} className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-[#FFF7FA] text-sm font-semibold font-poppins text-[#4A2C33] cursor-pointer"
                  >
                    <span className="max-w-[70px] truncate">Hi, {user.name.split(" ")[0]}!</span>
                    <span className="text-[#D6336C]">💕</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#FDE2EC] rounded-2xl shadow-lg overflow-hidden py-1 z-50">
                      <div className="px-4 py-2 border-b border-[#FFF7FA]">
                        <p className="text-xs font-poppins text-[#4A2C33]/60">Logged in as</p>
                        <p className="text-sm font-semibold font-poppins text-[#4A2C33] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthTab("login");
                    setIsAuthOpen(true);
                  }}
                  className="p-2 rounded-full hover:bg-[#FFF7FA] text-[#4A2C33]/70 hover:text-[#D6336C] cursor-pointer"
                >
                  <User className="w-5.5 h-5.5" />
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar Expansion */}
        <div className="px-4 pb-3 block md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                placeholder="Search bouquets, hampers, decor..."
                className="w-full pl-9 pr-8 py-1.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-full text-xs font-poppins text-[#4A2C33] focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
              />
              <Search className="w-3.5 h-3.5 text-[#4A2C33]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A2C33]/50 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Auto-complete Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#FDE2EC] rounded-2xl shadow-lg overflow-hidden z-50">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSuggestionClick(p.id)}
                      className="w-full px-4 py-2.5 text-left text-xs font-poppins text-[#4A2C33] hover:bg-[#FFF7FA] border-b border-[#FFF7FA] last:border-b-0 flex items-center gap-3 cursor-pointer"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-xs text-[#D6336C] font-semibold">₹{p.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-xs font-poppins text-[#4A2C33]/50">
                    No exact match. Press Enter to search all tags 🌸
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </header>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />
    </>
  );
}
