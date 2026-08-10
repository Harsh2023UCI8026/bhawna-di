export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  category: string;
  subCategory: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isTrending: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "bouquets-flowers",
    name: "Bouquets & Flowers",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
    subCategories: ["Rose Bouquets", "Mixed Flower Bouquets", "Dried Flower Bouquets", "Flower Baskets", "Fresh Bouquets"]
  },
  {
    id: "gifts",
    name: "Gifts",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    subCategories: ["Gifts for Him", "Gifts for Her", "Birthday Gifts", "Anniversary Gifts", "Gifts for Friends", "Valentine's Day Gifts", "Gifts for Parents", "Gifts for Kids"]
  },
  {
    id: "decor",
    name: "Decorative Items",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    subCategories: ["Wall Decor", "Table Decor", "Showpieces", "Fairy Lights", "Photo Frames"]
  },
  {
    id: "purses-bags",
    name: "Purses & Bags",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&w=600&q=80",
    subCategories: ["Handbags", "Pouches", "Clutches", "Sling Bags"]
  },
  {
    id: "custom",
    name: "Custom & Personalised",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
    subCategories: ["Personalised Hampers", "Name-customised Items", "Made-to-order"]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "blushing-rose-bouquet",
    name: "Blushing Rose Pipe-Cleaner Bouquet",
    price: 899,
    originalPrice: 1200,
    description: "Indulge in everlasting beauty with this handmade pipe-cleaner rose bouquet. Meticulously shaped by hand, these roses will never wither, serving as a permanent symbol of affection. Perfect for birthdays, anniversaries, or just to make Kirtika's favorites feel special. Comes in gorgeous pink pastel wrapping with a matching satin bow.",
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Bouquets & Flowers",
    subCategory: "Rose Bouquets",
    tags: ["rose", "bouquet", "handmade", "pink", "anniversary", "gifts for her"],
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    isTrending: true
  },
  {
    id: "vintage-dried-blooms",
    name: "Vintage Dried Flower Bouquet",
    price: 1199,
    originalPrice: 1599,
    description: "A rustic combination of dried lavender, baby's breath, and preserved pink bunny tails. Wrapped in eco-friendly brown craft paper with a vintage lace trim. This bouquet brings a warm, earthy aesthetic to any bedroom or study table, offering natural fragrance and timeless style.",
    images: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502622645696-cf98a67e996c?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Bouquets & Flowers",
    subCategory: "Dried Flower Bouquets",
    tags: ["dried flowers", "vintage", "decor", "gift", "lavender"],
    rating: 4.6,
    reviewsCount: 15,
    inStock: true,
    isTrending: false
  },
  {
    id: "personalised-love-hamper",
    name: "Cozy Floral Gift Hamper (Customisable)",
    price: 1999,
    originalPrice: 2499,
    description: "The ultimate gifting bundle, featuring a small handmade rose basket, a customizable scented soy candle, a cute floral pouch, and a handwritten card. You can customize the name on the candle and choose the scent (Vanilla Pink or Lavender Dream). It comes packaged in our signature pink box with heart-shaped confetti.",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Custom & Personalised",
    subCategory: "Personalised Hampers",
    tags: ["hamper", "custom", "candle", "gift box", "gifts for her", "valentine"],
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    isTrending: true
  },
  {
    id: "blossom-crochet-pouch",
    name: "Hand-Knitted Blossom Pouch",
    price: 499,
    originalPrice: 699,
    description: "Carry your makeup or daily essentials in style with this hand-knitted pastel pink cotton pouch. Detailed with delicate white daisy crochet appliques and a secure gold zipper. It is soft to touch, fully lined with water-resistant fabric inside, and features a cute pearl zipper pull.",
    images: [
      "https://images.unsplash.com/photo-1627124118123-24d187824baf?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Purses & Bags",
    subCategory: "Pouches",
    tags: ["crochet", "pouch", "bag", "daisy", "accessories"],
    rating: 4.7,
    reviewsCount: 18,
    inStock: true,
    isTrending: true
  },
  {
    id: "rose-gold-clutch",
    name: "Elegant Pink Macramé Clutch",
    price: 799,
    originalPrice: 999,
    description: "Add a bohemian touch to your outfit with this hand-woven macramé clutch. Made from premium organic cotton cord in blush pink, featuring a magnetic button clasp and a matching wristlet tassel. Perfect for casual day-outings or wedding celebrations.",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Purses & Bags",
    subCategory: "Clutches",
    tags: ["macrame", "clutch", "bag", "woven", "handmade"],
    rating: 4.5,
    reviewsCount: 12,
    inStock: true,
    isTrending: false
  },
  {
    id: "fairy-lights-floral-jar",
    name: "Glowing Fairy-Light Flower Jar",
    price: 649,
    originalPrice: 850,
    description: "Light up your workspace or bedside table with this magical Mason Jar. Filled with preserved pink hydrangeas and micro LED warm-white fairy lights (battery operated). Emitted light passes softly through the flowers, creating a dreamlike, cozy aesthetic for your room. Makes a lovely housewarming gift.",
    images: [
      "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Decorative Items",
    subCategory: "Fairy Lights",
    tags: ["decor", "lights", "mason jar", "flowers", "cozy"],
    rating: 4.8,
    reviewsCount: 29,
    inStock: true,
    isTrending: true
  },
  {
    id: "floral-initial-frame",
    name: "Custom Floral Initial Pressed Frame",
    price: 999,
    originalPrice: 1399,
    description: "An elegant, glass floating frame containing pressed flowers arranged in the shape of any initial letter (A-Z) of your choice. Specify the letter and flower colors (pinks, blues, yellows) in the personalization box. A gorgeous, personalized addition to a vanity or nursery room.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Decorative Items",
    subCategory: "Photo Frames",
    tags: ["frame", "pressed flowers", "custom", "wall decor", "initial"],
    rating: 4.9,
    reviewsCount: 33,
    inStock: true,
    isTrending: false
  }
];
