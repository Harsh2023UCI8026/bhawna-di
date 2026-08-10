import { Product } from "@/data/products";

// Define structures
export interface Review {
  id: string;
  productId: string;
  rating: number;
  text: string;
  photo?: string; // base64 string
  userName: string;
  date: string;
}

export interface CustomOrderRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  description: string;
  image?: string; // base64 string
  budget?: string;
  deliveryDate?: string;
  date: string;
  status: "Received" | "Reviewed" | "Contacted" | "Completed";
}

export interface User {
  name: string;
  email: string;
  password?: string;
  gender: string;
  isVerified: boolean;
  provider: "local" | "google" | "facebook" | "apple";
}

export interface CartItem {
  product: Product;
  quantity: number;
  personalisation?: string;
}

// Initial Static Reviews (Mocking pre-existing reviews)
const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "blushing-rose-bouquet",
    rating: 5,
    text: "So beautiful and cute! The packaging was perfect, and the roses look so premium. Kirtika did an amazing job! 💕",
    userName: "Riya Sharma",
    date: "2026-08-01"
  },
  {
    id: "r2",
    productId: "blushing-rose-bouquet",
    rating: 4,
    text: "Loved the bouquet, it was a hit as an anniversary gift. Handcrafting is very detailed.",
    userName: "Amit Verma",
    date: "2026-07-28"
  },
  {
    id: "r3",
    productId: "personalised-love-hamper",
    rating: 5,
    text: "The candle smells wonderful and the initial frame came out exactly as requested! Heart confetti inside was such a cute surprise.",
    userName: "Sneha Jha",
    date: "2026-08-03"
  },
  {
    id: "r4",
    productId: "blossom-crochet-pouch",
    rating: 5,
    text: "The pearl zipper pull is such a pookie touch! Very durable pouch, fits all my lipsticks.",
    userName: "Isha Patel",
    date: "2026-08-02"
  }
];

// Helper to check if window is defined (SSR safety)
const isClient = () => typeof window !== "undefined";

// --- CART STORAGE ---
export const getCart = (): CartItem[] => {
  if (!isClient()) return [];
  const cart = localStorage.getItem("sakaar_cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
  if (!isClient()) return;
  localStorage.setItem("sakaar_cart", JSON.stringify(cart));
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("sakaar_cart_update"));
};

export const addToCart = (product: Product, quantity: number, personalisation?: string) => {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.product.id === product.id && item.personalisation === personalisation
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity, personalisation });
  }
  saveCart(cart);
};

export const removeFromCart = (productId: string, personalisation?: string) => {
  const cart = getCart();
  const updated = cart.filter(
    item => !(item.product.id === productId && item.personalisation === personalisation)
  );
  saveCart(updated);
};

export const updateCartQuantity = (productId: string, quantity: number, personalisation?: string) => {
  const cart = getCart();
  const idx = cart.findIndex(
    item => item.product.id === productId && item.personalisation === personalisation
  );
  if (idx > -1) {
    cart[idx].quantity = quantity;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    saveCart(cart);
  }
};

export const clearCart = () => {
  saveCart([]);
};

// --- WISHLIST / LIKES STORAGE ---
export const getWishlist = (): string[] => {
  if (!isClient()) return [];
  const wish = localStorage.getItem("sakaar_wishlist");
  return wish ? JSON.parse(wish) : [];
};

export const toggleWishlist = (productId: string): boolean => {
  if (!isClient()) return false;
  const wish = getWishlist();
  const index = wish.indexOf(productId);
  let liked = false;
  
  if (index > -1) {
    wish.splice(index, 1);
    liked = false;
  } else {
    wish.push(productId);
    liked = true;
  }
  
  localStorage.setItem("sakaar_wishlist", JSON.stringify(wish));
  window.dispatchEvent(new Event("sakaar_wishlist_update"));
  return liked;
};

// --- REVIEWS STORAGE ---
export const getReviews = (productId: string): Review[] => {
  if (!isClient()) return INITIAL_REVIEWS.filter(r => r.productId === productId);
  
  const localReviewsStr = localStorage.getItem("sakaar_reviews");
  const localReviews: Review[] = localReviewsStr ? JSON.parse(localReviewsStr) : [];
  
  // Combine initial static reviews and user submitted ones
  const allReviews = [...INITIAL_REVIEWS, ...localReviews];
  return allReviews.filter(r => r.productId === productId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addReview = (productId: string, rating: number, text: string, userName: string, photo?: string) => {
  if (!isClient()) return;
  const localReviewsStr = localStorage.getItem("sakaar_reviews");
  const localReviews: Review[] = localReviewsStr ? JSON.parse(localReviewsStr) : [];
  
  const newReview: Review = {
    id: "ur_" + Math.random().toString(36).substr(2, 9),
    productId,
    rating,
    text,
    photo,
    userName: userName || "Lovely Customer",
    date: new Date().toISOString().split("T")[0]
  };
  
  localReviews.push(newReview);
  localStorage.setItem("sakaar_reviews", JSON.stringify(localReviews));
  window.dispatchEvent(new Event("sakaar_reviews_update"));
};

// --- CUSTOM ORDERS STORAGE ---
export const getCustomOrders = (): CustomOrderRequest[] => {
  if (!isClient()) return [];
  const orders = localStorage.getItem("sakaar_custom_orders");
  return orders ? JSON.parse(orders) : [];
};

export const addCustomOrder = (order: Omit<CustomOrderRequest, "id" | "date" | "status">) => {
  if (!isClient()) return;
  const orders = getCustomOrders();
  const newOrder: CustomOrderRequest = {
    ...order,
    id: "co_" + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString().split("T")[0],
    status: "Received"
  };
  orders.push(newOrder);
  localStorage.setItem("sakaar_custom_orders", JSON.stringify(orders));
};

// --- AUTH / USER SESSION STORAGE ---
export const getUsers = (): User[] => {
  if (!isClient()) return [];
  const users = localStorage.getItem("sakaar_users");
  return users ? JSON.parse(users) : [];
};

export const registerUser = (user: User): { success: boolean; error?: string } => {
  if (!isClient()) return { success: false };
  const users = getUsers();
  
  if (users.some(u => u.email === user.email)) {
    return { success: false, error: "Email already registered!" };
  }
  
  users.push(user);
  localStorage.setItem("sakaar_users", JSON.stringify(users));
  return { success: true };
};

export const verifyUserEmail = (email: string): boolean => {
  if (!isClient()) return false;
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx > -1) {
    users[idx].isVerified = true;
    localStorage.setItem("sakaar_users", JSON.stringify(users));
    return true;
  }
  return false;
};

export const getLoggedInUser = (): User | null => {
  if (!isClient()) return null;
  const session = localStorage.getItem("sakaar_session");
  return session ? JSON.parse(session) : null;
};

export const loginUser = (email: string, password?: string, isSocial = false): { success: boolean; error?: string } => {
  if (!isClient()) return { success: false };
  const users = getUsers();
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    if (isSocial) {
      // Auto register social users
      const newUser: User = {
        name: email.split("@")[0],
        email,
        gender: "Prefer not to say",
        isVerified: true,
        provider: "google" // Default mock provider
      };
      registerUser(newUser);
      localStorage.setItem("sakaar_session", JSON.stringify(newUser));
      window.dispatchEvent(new Event("sakaar_auth_update"));
      return { success: true };
    }
    return { success: false, error: "User not found!" };
  }
  
  if (!isSocial) {
    if (user.password !== password) {
      return { success: false, error: "Incorrect password!" };
    }
    if (!user.isVerified) {
      return { success: false, error: "EMAIL_NOT_VERIFIED" };
    }
  }
  
  localStorage.setItem("sakaar_session", JSON.stringify(user));
  window.dispatchEvent(new Event("sakaar_auth_update"));
  return { success: true };
};

export const logoutUser = () => {
  if (!isClient()) return;
  localStorage.removeItem("sakaar_session");
  window.dispatchEvent(new Event("sakaar_auth_update"));
};

export const resetPassword = (email: string, newPassword: string): boolean => {
  if (!isClient()) return false;
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx > -1) {
    users[idx].password = newPassword;
    users[idx].isVerified = true; // resets also verify the mail
    localStorage.setItem("sakaar_users", JSON.stringify(users));
    return true;
  }
  return false;
};
