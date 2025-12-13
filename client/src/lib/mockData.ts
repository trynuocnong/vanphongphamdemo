
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

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  stock: number;
  sold: number;
  category: "notebooks" | "writing" | "desk" | "paper";
  image: string;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  feedbacks: Feedback[];
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  pointCost: number;
  description: string;
}

export interface Offer {
  id: string;
  productId: string;
  userId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  offerPrice: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  counterPrice?: number;
  date: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: "processing" | "shipped" | "delivered";
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  points: number;
  vouchers: string[]; // voucher IDs
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Linen Notebook",
    price: 150000,
    description: "A high-quality linen cover notebook with 100gsm cream paper. Perfect for bullet journaling or sketching.",
    stock: 45,
    sold: 120,
    category: "notebooks",
    image: notebookImg,
    images: [notebookImg],
    isNew: true,
    feedbacks: [
      { id: "f1", user: "Alice", rating: 5, comment: "Amazing paper quality!", date: "2023-10-15" },
      { id: "f2", user: "Bob", rating: 4, comment: "Cover feels great.", date: "2023-10-10" },
    ],
  },
  {
    id: "2",
    name: "Solid Brass Fountain Pen",
    price: 450000,
    originalPrice: 550000,
    description: "Weighted brass pen that ages beautifully over time. Fine nib included.",
    stock: 12,
    sold: 34,
    category: "writing",
    image: penImg,
    images: [penImg],
    isSale: true,
    feedbacks: [
      { id: "f3", user: "Charlie", rating: 5, comment: "Heavy and smooth.", date: "2023-09-28" },
    ],
  },
  {
    id: "3",
    name: "Ceramic Desk Organizer",
    price: 280000,
    description: "Minimalist ceramic holder for all your stationery essentials.",
    stock: 8,
    sold: 56,
    category: "desk",
    image: organizerImg,
    images: [organizerImg],
    feedbacks: [],
  },
  {
    id: "4",
    name: "Washi Tape Set - Earth Tones",
    price: 85000,
    description: "Set of 5 washi tapes in muted earth tones.",
    stock: 100,
    sold: 450,
    category: "paper",
    image: "https://images.unsplash.com/photo-1595248883856-745a34db248a?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1595248883856-745a34db248a?auto=format&fit=crop&q=80&w=800"],
    feedbacks: [],
  },
  {
    id: "5",
    name: "Minimalist Weekly Planner",
    price: 120000,
    description: "Undated weekly planner pad. Tear-off sheets.",
    stock: 30,
    sold: 89,
    category: "notebooks",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"],
    isNew: true,
    feedbacks: [],
  },
  {
    id: "6",
    name: "Black Gel Pen 0.5mm",
    price: 25000,
    description: "Smooth writing gel pen. Quick dry ink.",
    stock: 500,
    sold: 1200,
    category: "writing",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800"],
    feedbacks: [],
  },
];

export const VOUCHERS: Voucher[] = [
  { id: "v1", code: "WELCOME10", discount: 10000, minSpend: 100000, pointCost: 0, description: "10k off orders over 100k" },
  { id: "v2", code: "SAVE50", discount: 50000, minSpend: 500000, pointCost: 500, description: "50k off orders over 500k" },
  { id: "v3", code: "FREESHIP", discount: 30000, minSpend: 300000, pointCost: 300, description: "Free shipping (max 30k)" },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Nguyen Van A",
  email: "user@example.com",
  role: "user",
  points: 1500,
  vouchers: ["v1"],
};

export const MOCK_ADMIN: User = {
  id: "a1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  points: 0,
  vouchers: [],
};
