
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, User, Offer, Order, Voucher, Category, PRODUCTS, MOCK_USERS, VOUCHERS, CATEGORIES } from "./mockData";
import { useToast } from "@/hooks/use-toast";
import { addDays, isAfter, parseISO } from "date-fns";

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  priceUsed: number; // Could be offer price or regular price
}

interface StoreContextType {
  user: User | null;
  users: User[];
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  offers: Offer[];
  vouchers: Voucher[];
  login: (email: string, role: "user" | "admin") => boolean;
  register: (user: Omit<User, "id" | "points" | "vouchers" | "role">) => void;
  resetPassword: (email: string) => void;
  logout: () => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addToCart: (product: Product, quantity: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  checkout: (voucherId?: string) => void;
  makeOffer: (productId: string, price: number, message?: string) => void;
  respondToOffer: (offerId: string, status: "accepted" | "rejected" | "countered", counterPrice?: number) => void;
  redeemVoucher: (voucherId: string) => void;
  
  // CRUD
  addProduct: (product: Omit<Product, "id" | "sold" | "feedbacks" | "createdAt">) => void;
  deleteProduct: (id: string) => void; // Soft delete
  updateProduct: (id: string, data: Partial<Product>) => void;
  
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addVoucher: (voucher: Omit<Voucher, "id">) => void;
  updateVoucher: (id: string, data: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;

  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  checkOfferBlock: (userId: string, productId: string) => boolean;

  // Feedback
  addFeedback: (productId: string, rating: number, comment: string) => void;
  deleteFeedback: (productId: string, feedbackId: string) => void;
  hasPurchased: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]); // Default logged in for easier dev, or null
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS);
  const { toast } = useToast();

  const login = (email: string, role: "user" | "admin") => {
    // Simple mock login
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      if (foundUser.isBlocked) {
        toast({ title: "Account Blocked", description: "Please contact support.", variant: "destructive" });
        return false;
      }
      setUser(foundUser);
      toast({ title: `Logged in as ${role}` });
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, "id" | "points" | "vouchers" | "role">) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      points: 0,
      vouchers: ["v1"], // Welcome voucher
    };
    setUsers(prev => [...prev, newUser]);
    toast({ title: "Account created successfully", description: "You can now login." });
  };

  const resetPassword = (email: string) => {
    // Mock reset
    const exists = users.find(u => u.email === email);
    if (exists) {
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
    } else {
      toast({ title: "Email not found", variant: "destructive" });
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast({ title: "Logged out" });
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
    toast({ title: "User updated" });
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: "User deleted" });
  };

  const addToCart = (product: Product, quantity: number, priceOverride?: number) => {
    if (product.stock < quantity) {
      toast({ title: "Not enough stock", variant: "destructive" });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId: product.id, quantity, product, priceUsed: priceOverride || product.price }];
    });
    toast({ title: "Added to cart" });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && product.stock < quantity) {
       toast({ title: `Only ${product.stock} available`, variant: "destructive" });
       return;
    }

    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const checkout = (voucherId?: string) => {
    if (!user) return;
    
    let total = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);
    
    // Check if any item uses an offer price - if so, voucher logic might change
    const hasOfferPrice = cart.some(item => item.priceUsed < item.product.price);

    if (voucherId) {
       if (hasOfferPrice) {
         toast({ title: "Voucher ignored", description: "Vouchers cannot be combined with offer prices.", variant: "destructive" });
       } else {
         const voucher = vouchers.find(v => v.id === voucherId);
         if (voucher) {
           total = Math.max(0, total - voucher.discount);
         }
       }
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.priceUsed,
        name: item.product.name
      })),
      total,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Update stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.productId === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity, sold: p.sold + cartItem.quantity };
      }
      return p;
    }));

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    
    // Add points regardless of offer usage
    const pointsEarned = Math.floor(total / 10000);
    updateUser(user.id, { points: user.points + pointsEarned });
    
    toast({ title: "Order placed successfully!", description: `You earned ${pointsEarned} points.` });
  };

  const checkOfferBlock = (userId: string, productId: string) => {
     const rejectedCount = offers.filter(o => 
       o.userId === userId && 
       o.productId === productId && 
       o.status === "rejected"
     ).length;
     return rejectedCount >= 5;
  };

  const makeOffer = (productId: string, price: number, message?: string) => {
    if (!user) {
      toast({ title: "Please login first" });
      return;
    }

    if (checkOfferBlock(user.id, productId)) {
      toast({ title: "Offer Blocked", description: "You have exceeded the maximum number of rejected offers for this product.", variant: "destructive" });
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!product.allowOffers) {
      toast({ title: "Offers not allowed for this product", variant: "destructive" });
      return;
    }

    let status: Offer["status"] = "pending";
    let acceptedAt = undefined;

    // Auto Accept Logic
    if (product.autoAcceptPrice && price >= product.autoAcceptPrice) {
      status = "accepted";
      acceptedAt = new Date().toISOString();
      toast({ title: "Offer instantly accepted!", description: "You can now buy at this price." });
    }
    // Auto Reject Logic
    else if (product.autoRejectPrice && price < product.autoRejectPrice) {
      status = "rejected";
      toast({ title: "Offer rejected", description: "Price is too low." });
    } else {
      toast({ title: "Offer sent to seller" });
    }

    const newOffer: Offer = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userId: user.id,
      productName: product.name,
      productImage: product.image,
      originalPrice: product.price,
      offerPrice: price,
      message,
      status,
      acceptedAt,
      date: new Date().toISOString(),
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const respondToOffer = (offerId: string, status: "accepted" | "rejected" | "countered", counterPrice?: number) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return { 
          ...o, 
          status, 
          counterPrice, 
          acceptedAt: status === "accepted" ? new Date().toISOString() : undefined 
        };
      }
      return o;
    }));
    toast({ title: `Offer ${status}` });
  };

  const redeemVoucher = (voucherId: string) => {
    if (!user) return;
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;

    if (user.points >= voucher.pointCost) {
      updateUser(user.id, { 
        points: user.points - voucher.pointCost, 
        vouchers: [...user.vouchers, voucher.id] 
      });
      toast({ title: "Voucher redeemed!" });
    } else {
      toast({ title: "Not enough points", variant: "destructive" });
    }
  };
  
  // Products CRUD
  const addProduct = (productData: Omit<Product, "id" | "sold" | "feedbacks" | "createdAt">) => {
      const newProduct: Product = {
          ...productData,
          id: Math.random().toString(36).substr(2, 9),
          sold: 0,
          feedbacks: [],
          createdAt: new Date().toISOString(),
      };
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: "Product created" });
  };

  const deleteProduct = (id: string) => {
      // Soft delete
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true } : p));
      toast({ title: "Product removed from listing" });
  };
  
  const updateProduct = (id: string, data: Partial<Product>) => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      toast({ title: "Product updated" });
  };

  // Categories CRUD
  const addCategory = (data: Omit<Category, "id">) => {
    const newCat = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCat]);
    toast({ title: "Category added" });
  };
  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast({ title: "Category updated" });
  };
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({ title: "Category deleted" });
  };

  // Vouchers CRUD
  const addVoucher = (data: Omit<Voucher, "id">) => {
    const newVoucher = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setVouchers(prev => [...prev, newVoucher]);
    toast({ title: "Voucher added" });
  };
  const updateVoucher = (id: string, data: Partial<Voucher>) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    toast({ title: "Voucher updated" });
  };
  const deleteVoucher = (id: string) => {
    setVouchers(prev => prev.filter(v => v.id !== id));
    toast({ title: "Voucher deleted" });
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast({ title: `Order marked as ${status}` });
  };

  // Feedback
  const hasPurchased = (productId: string) => {
    if (!user) return false;
    // Check if user has a completed order containing this product
    return orders.some(o => 
      o.userId === user.id && 
      o.status === "completed" && 
      o.items.some(i => i.productId === productId)
    );
  };

  const addFeedback = (productId: string, rating: number, comment: string) => {
    if (!user) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          feedbacks: [
            ...p.feedbacks,
            {
              id: Math.random().toString(36).substr(2, 9),
              user: user.name,
              rating,
              comment,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return p;
    }));
    toast({ title: "Review submitted", description: "Thank you for your feedback!" });
  };

  const deleteFeedback = (productId: string, feedbackId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          feedbacks: p.feedbacks.filter(f => f.id !== feedbackId)
        };
      }
      return p;
    }));
    toast({ title: "Feedback deleted" });
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        users,
        products,
        categories,
        cart,
        orders,
        offers,
        vouchers,
        login,
        register,
        resetPassword,
        logout,
        updateUser,
        deleteUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkout,
        makeOffer,
        respondToOffer,
        redeemVoucher,
        addProduct,
        deleteProduct,
        updateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        updateOrderStatus,
        checkOfferBlock,
        addFeedback,
        deleteFeedback,
        hasPurchased
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
