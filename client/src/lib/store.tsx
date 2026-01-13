<<<<<<< Updated upstream

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, User, Offer, Order, Voucher, Category, PRODUCTS, MOCK_USERS, VOUCHERS, CATEGORIES } from "./mockData";
import { useToast } from "@/hooks/use-toast";
import { addDays, isAfter, parseISO } from "date-fns";
=======
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Product, User, Offer, Order, Voucher, Category } from "@/types";
>>>>>>> Stashed changes

import {
  getProducts,
  addProduct as addProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
} from "@/services/productService";

import {
  getUsers,
  registerUser,
  updateUser as updateUserAPI,
} from "@/services/userService";

import {
  getOrders,
  createOrder,
  updateOrderStatus as updateOrderStatusAPI,
} from "@/services/orderService";

import {
  addToCart as addToCartAPI,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearUserCart,
} from "@/services/cartService";

import {
  getVouchers,
  addVoucher as addVoucherAPI,
  updateVoucher as updateVoucherAPI,
  deleteVoucher as deleteVoucherAPI,
} from "@/services/voucherService";

import {
  getOffers,
  createOffer,
  respondToOffer as respondToOfferAPI,
} from "@/services/offerService";

/* ===================== TYPES ===================== */
interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  priceUsed: number;
}

interface StoreContextType {
  user: User | null;
  authReady: boolean;
  users: User[];
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  offers: Offer[];
  vouchers: Voucher[];
<<<<<<< Updated upstream
=======
  appliedVoucherId?: string;
  
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  setAppliedVoucherId: (id?: string) => void;

>>>>>>> Stashed changes
  login: (email: string, role: "user" | "admin") => boolean;
  register: (data: Omit<User, "id" | "points" | "vouchers" | "role">) => void;
  logout: () => void;

  addToCart: (product: Product, quantity: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
<<<<<<< Updated upstream
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
=======

  checkout: (data: {
    shippingAddress: any;
    paymentMethod: string;
  }) => void;

  redeemVoucher: (voucherId: string) => void;

  makeOffer: (productId: string, price: number, message?: string) => void;
  respondToOffer: (offerId: string, status: Offer["status"]) => void;

  addProduct: (data: Omit<Product, "id" | "sold" | "feedbacks" | "createdAt">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addVoucher: (data: Omit<Voucher, "id">) => void;
>>>>>>> Stashed changes
  updateVoucher: (id: string, data: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;

  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
addFeedback: (
  productId: string,
  rating: number,
  comment: string
) => Promise<void>;

  refetchAll: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

/* ===================== PROVIDER ===================== */
export function StoreProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
const [authReady, setAuthReady] = useState(false); 


  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
<<<<<<< Updated upstream
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS);
  const { toast } = useToast();
=======
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucherId, setAppliedVoucherId] = useState<string>();

  /* ===================== LOAD USER FROM STORAGE ===================== */
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  /* ===================== REFETCH ALL ===================== */
  const refetchAll = async () => {
  try {
    const [
      productsData,
      usersData,
      ordersData,
      offersData,
      vouchersData,
    ] = await Promise.all([
      getProducts(),
      getUsers(),
      getOrders(),
      getOffers(),
      getVouchers(),
    ]);

    setProducts(productsData);
    setUsers(usersData);
    setOrders(ordersData);
    setOffers(offersData);
    setVouchers(vouchersData);

    // ✅ SYNC USER TỪ API
    setUser(prev => {
      if (!prev) return null;
      const fresh = usersData.find(u => u.id === prev.id);
      if (!fresh) return null;

      localStorage.setItem("auth_user", JSON.stringify(fresh));
      return fresh;
    });
  } finally {
    // ✅ AUTH READY CHỈ SET SAU KHI DATA ĐÃ LOAD
    setAuthReady(true);
  }
};


  useEffect(() => {
    refetchAll();
  }, []);
>>>>>>> Stashed changes

  /* ===================== AUTH ===================== */
  const login = (email: string, role: "user" | "admin") => {
<<<<<<< Updated upstream
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
=======
    const found = users.find(u => u.email === email && u.role === role);
    if (!found) return false;
    if (found.isBlocked) {
      toast.error("Account blocked");
      return false;
>>>>>>> Stashed changes
    }
    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));
    toast.success("Logged in");
    return true;
  };

<<<<<<< Updated upstream
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
=======
  const register = async (data: any) => {
    await registerUser({ ...data, role: "user" });
    await refetchAll();
    toast.success("Registered");
>>>>>>> Stashed changes
  };

  const logout = () => {
    setUser(null);
    setCart([]);
<<<<<<< Updated upstream
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
=======
    localStorage.removeItem("auth_user");
  };
  const updateUser = async (id: string, data: Partial<User>) => {
  const current = users.find(u => u.id === id);
  if (!current) return;

  const updatedUser: User = {
    ...current,   
    ...data,
  };

  await updateUserAPI(id, updatedUser);

  // update store
setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));

setUser(updatedUser);
localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  // sync auth user
  if (user?.id === id) {
    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  }

  toast.success("User updated");
};

  /* ===================== CART (SAFE) ===================== */
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const loadCart = async () => {
      const items = await getCartItems(user.id);

      const safeCart = items
        .map((i: any) => {
          const product = products.find(p => p.id === i.productId);
          if (!product) return null;
          return {
            productId: i.productId,
            quantity: i.quantity,
            priceUsed: i.price,
            product,
          };
        })
        .filter(Boolean) as CartItem[];

      setCart(safeCart);
    };

    loadCart();
  }, [user, products]);

  const addToCart = async (product: Product, quantity: number, priceOverride?: number) => {
    if (!user) return toast.error("Login first");
    await addToCartAPI(user.id, product, quantity, priceOverride);
    await refetchAll();
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    const items = await getCartItems(user.id);
    const item = items.find((i: any) => i.productId === productId);
    if (item) await removeCartItem(item.id);
    await refetchAll();
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    const items = await getCartItems(user.id);
    const item = items.find((i: any) => i.productId === productId);
    if (item) await updateCartItem(item.id, quantity);
    await refetchAll();
  };

  /* ===================== CHECKOUT ===================== */
  const checkout = async (data: any) => {
    if (!user || cart.length === 0) return;

    const subtotal = cart.reduce(
      (s, i) => s + i.priceUsed * i.quantity,
      0
    );

    const voucher = vouchers.find(v => v.id === appliedVoucherId);
    const discount = voucher ? voucher.discount : 0;

    const order: Order = {
>>>>>>> Stashed changes
      userId: user.id,
      items: cart.map(i => ({
        productId: i.productId,
        name: i.product.name,
        quantity: i.quantity,
        price: i.priceUsed,
      })),
      total: Math.max(0, subtotal - discount),
      status: "pending",
      date: new Date().toISOString(),
<<<<<<< Updated upstream
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
=======
      voucherId: voucher?.id,
      voucherDiscount: discount,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
    };

    await createOrder(order);
    await clearUserCart(user.id);

    setAppliedVoucherId(undefined);
    await refetchAll();
    setCart([]);

    toast.success("Thanh toán thành công");
  };

  /* ===================== REDEEM VOUCHER ===================== */
  const redeemVoucher = async (voucherId: string) => {
>>>>>>> Stashed changes
    if (!user) return;

    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;

<<<<<<< Updated upstream
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
=======
    if (user.points < voucher.pointCost) {
      toast.error("Không đủ điểm");
      return;
    }

    const updatedUser = {
      ...user,
      points: user.points - voucher.pointCost,
      vouchers: [...(user.vouchers || []), voucherId],
    };

    await updateUserAPI(user.id, updatedUser);

    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    await refetchAll();

    toast.success("Đổi voucher thành công");
  };

  /* ===================== OFFERS ===================== */
  const makeOffer = async (productId: string, price: number, message?: string) => {
    if (!user) return;
    await createOffer({ productId, userId: user.id, offerPrice: price, message });
    await refetchAll();
  };

  const respondToOffer = async (offerId: string, status: Offer["status"]) => {
    await respondToOfferAPI(offerId, status);
    await refetchAll();
  };
  const addFeedback = async (
  productId: string,
  rating: number,
  comment: string
) => {
  if (!user) return;

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const feedback = {
    userId: user.id,
    userName: user.name,
    rating,
    comment,
    date: new Date().toISOString(),
  };

  const updatedProduct = {
    ...product,
    feedbacks: [...(product.feedbacks || []), feedback],
  };

  await updateProductAPI(productId, updatedProduct);
  await refetchAll();

  toast.success("Review submitted");
};


  /* ===================== PRODUCTS ===================== */
  const addProduct = async (data: any) => {
    await addProductAPI({ ...data, sold: 0, createdAt: new Date().toISOString() });
    await refetchAll();
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    await updateProductAPI(id, data);
    await refetchAll();
  };

  const deleteProduct = async (id: string) => {
    await deleteProductAPI(id);
    await refetchAll();
  };

  /* ===================== VOUCHERS ===================== */
  const addVoucher = async (data: any) => {
    await addVoucherAPI(data);
    await refetchAll();
  };

  const updateVoucher = async (id: string, data: Partial<Voucher>) => {
    await updateVoucherAPI(id, data);
    await refetchAll();
  };

const deleteVoucher = async (id: string) => {
  await deleteVoucherAPI(id);

  //CLEAN voucher khỏi user
  const affectedUsers = users.filter(u => u.vouchers?.includes(id));

  for (const u of affectedUsers) {
    await updateUserAPI(u.id, {
      ...u,
      vouchers: u.vouchers.filter(v => v !== id),
    });
  }

  await refetchAll();
  toast.success("Voucher deleted");
};


  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatusAPI(orderId, status);
    await refetchAll();
>>>>>>> Stashed changes
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        authReady,
        users,
        products,
        categories,
        cart,
        orders,
        offers,
        vouchers,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkout,
        redeemVoucher,
        makeOffer,
        respondToOffer,
        updateUser,
        addProduct,
        updateProduct,
        deleteProduct,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        updateOrderStatus,
        addFeedback,

        refetchAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
