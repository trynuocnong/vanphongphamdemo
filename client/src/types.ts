// User types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    points: number;
    vouchers: string[];
    isBlocked?: boolean;
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    memberSince?: string;
    twoFactorEnabled?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    wishlist?: string[]; // Array of product IDs
}

// Category types
export interface Category {
    id: string;
    name: string;
}

// Product types
export interface ProductFeedback {
    id?: string;
    userId?: string;
    user?: string;
    userName?: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    sold?: number;
    categoryId: string;
    categoryName?: string;
    image: string;
    images?: string[];
    isNew?: boolean;
    allowOffers?: boolean;
    autoAcceptPrice?: number;
    autoRejectPrice?: number;
    feedbacks?: ProductFeedback[];
    createdAt?: string;
}

// Voucher types
export interface Voucher {
    id: string;
    code: string;
    discount: number;
    minSpend: number;
    pointCost: number;
    description: string;
    detailedConditions?: string;
}

// Offer types
export interface Offer {
    id: string;
    productId: string;
    productName?: string;
    productImage?: string;
    originalPrice?: number;
    userId: string;
    userName?: string;
    offerPrice: number;
    message?: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    acceptedAt?: string | null;
}

// Order types
export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface Order {
    id?: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
    date: string;
    voucherId?: string;
    voucherDiscount?: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    shippingFee?: number;
}

// Address types
export interface Address {
    id: string;
    userId: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
}

// Login History types
export interface LoginHistory {
    id: string;
    userId: string;
    device: string;
    location: string;
    ipAddress: string;
    timestamp: string;
    status: "success" | "failed";
}

// Active Session types
export interface ActiveSession {
    id: string;
    userId: string;
    device: string;
    location: string;
    ipAddress: string;
    lastActive: string;
    createdAt: string;
    isCurrent: boolean;
}
