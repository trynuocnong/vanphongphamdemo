
import notebookImg from "@assets/generated_images/premium_notebook.png";
import penImg from "@assets/generated_images/brass_pen.png";
import organizerImg from "@assets/generated_images/ceramic_desk_organizer.png";

export interface Feedback {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  stock: number;
  sold: number;
  categoryId: string; // Changed from literal string to ID
  categoryName: string; // Keep for display convenience or join
  image: string;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  isDeleted?: boolean; // Soft delete
  allowOffers: boolean;
  autoAcceptPrice?: number;
  autoRejectPrice?: number;
  feedbacks: Feedback[];
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  pointCost: number;
  description: string;
  detailedConditions: string;
  applicableCategoryIds?: string[]; // If empty, applicable to all
}

export interface Offer {
  id: string;
  productId: string;
  userId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  offerPrice: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "countered";
  counterPrice?: number;
  date: string;
  acceptedAt?: string; // For 24h expiry logic
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: "pending" | "shipping" | "completed" | "cancelled";
  date: string;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod?: "credit_card" | "momo" | "zalopay" | "cod";
  shippingFee?: number;
  voucherDiscount?: number;
}


export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string; // Mock password
  role: "user" | "admin";
  points: number;
  vouchers: string[]; // voucher IDs
  isBlocked?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "c1", name: "Notebooks", description: "Premium paper goods" },
  { id: "c2", name: "Writing", description: "Pens, pencils, and inks" },
  { id: "c3", name: "Desk", description: "Organizers and accessories" },
  { id: "c4", name: "Paper", description: "Specialty paper and tapes" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Linen Notebook",
    price: 150000,
    description: "A high-quality linen cover notebook with 100gsm cream paper. Perfect for bullet journaling or sketching.",
    stock: 45,
    sold: 120,
    categoryId: "c1",
    categoryName: "Notebooks",
    image: notebookImg,
    images: [notebookImg],
    isNew: true,
    allowOffers: true,
    autoAcceptPrice: 140000,
    autoRejectPrice: 100000,
    feedbacks: [
      { id: "f1", user: "Alice", rating: 5, comment: "Amazing paper quality!", date: "2023-10-15" },
      { id: "f2", user: "Bob", rating: 4, comment: "Cover feels great.", date: "2023-10-10" },
    ],
    createdAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Solid Brass Fountain Pen",
    price: 450000,
    originalPrice: 550000,
    description: "Weighted brass pen that ages beautifully over time. Fine nib included.",
    stock: 12,
    sold: 34,
    categoryId: "c2",
    categoryName: "Writing",
    image: penImg,
    images: [penImg],
    isSale: true,
    allowOffers: true,
    autoAcceptPrice: 420000,
    feedbacks: [
      { id: "f3", user: "Charlie", rating: 5, comment: "Heavy and smooth.", date: "2023-09-28" },
    ],
    createdAt: "2023-09-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Ceramic Desk Organizer",
    price: 280000,
    description: "Minimalist ceramic holder for all your stationery essentials.",
    stock: 8,
    sold: 56,
    categoryId: "c3",
    categoryName: "Desk",
    image: organizerImg,
    images: [organizerImg],
    allowOffers: false,
    feedbacks: [],
    createdAt: "2023-08-20T10:00:00Z",
  },
  {
    id: "4",
    name: "Washi Tape Set - Earth Tones",
    price: 85000,
    description: "Set of 5 washi tapes in muted earth tones.",
    stock: 100,
    sold: 450,
    categoryId: "c4",
    categoryName: "Paper",
    image: "https://images.unsplash.com/photo-1595248883856-745a34db248a?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1595248883856-745a34db248a?auto=format&fit=crop&q=80&w=800"],
    allowOffers: true,
    feedbacks: [],
    createdAt: "2023-11-01T10:00:00Z",
  },
  {
    id: "5",
    name: "Minimalist Weekly Planner",
    price: 120000,
    description: "Undated weekly planner pad. Tear-off sheets.",
    stock: 30,
    sold: 89,
    categoryId: "c1",
    categoryName: "Notebooks",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"],
    isNew: true,
    allowOffers: true,
    feedbacks: [],
    createdAt: "2025-01-05T10:00:00Z",
  },
  {
    id: "6",
    name: "Black Gel Pen 0.5mm",
    price: 25000,
    description: "Smooth writing gel pen. Quick dry ink.",
    stock: 500,
    sold: 1200,
    categoryId: "c2",
    categoryName: "Writing",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800"],
    allowOffers: false,
    feedbacks: [],
    createdAt: "2023-06-01T10:00:00Z",
  },
];

export const VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "WELCOME10",
    discount: 10000,
    minSpend: 100000,
    pointCost: 0,
    description: "10k off orders over 100k",
    detailedConditions: "Valid for new users. Minimum order value 100,000 VND. Applies to all categories."
  },
  {
    id: "v2",
    code: "SAVE50",
    discount: 50000,
    minSpend: 500000,
    pointCost: 500,
    description: "50k off orders over 500k",
    detailedConditions: "Redeemable with 500 points. Minimum order value 500,000 VND."
  },
  {
    id: "v3",
    code: "FREESHIP",
    discount: 30000,
    minSpend: 300000,
    pointCost: 300,
    description: "Free shipping (max 30k)",
    detailedConditions: "Max discount 30,000 VND. Minimum order value 300,000 VND. Cannot be combined with other offers."
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Nguyen Van A",
    email: "user@example.com",
    password: "password123",
    role: "user",
    points: 1500,
    vouchers: ["v1"],
    phone: "0901234567",
    address: "123 Le Loi, District 1, HCMC"
  },
  {
    id: "a1",
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpassword",
    role: "admin",
    points: 0,
    vouchers: [],
  }
];
