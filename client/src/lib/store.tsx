import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Product, User, Offer, Order, Voucher, Category } from "@/types";

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
  addToWishlist,
  removeFromWishlist,
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
  appliedVoucherId?: string;
  wishlist: string[];
  isCartOpen: boolean;

  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  setAppliedVoucherId: (id?: string) => void;

  login: (email: string, role: "user" | "admin") => boolean;
  register: (data: Omit<User, "id" | "points" | "vouchers" | "role">) => void;
  logout: () => void;

  addToCart: (product: Product, quantity: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;

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
  updateVoucher: (id: string, data: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;

  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addFeedback: (
    productId: string,
    rating: number,
    comment: string
  ) => Promise<void>;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

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
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucherId, setAppliedVoucherId] = useState<string>();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      setUser((prev: User | null) => {
        if (!prev) return null;
        const fresh = usersData.find((u: User) => u.id === prev.id);
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

  // Load wishlist from user data
  useEffect(() => {
    if (user) {
      setWishlist(user.wishlist || []);
    } else {
      setWishlist([]);
    }
  }, [user]);

  /* ===================== AUTH ===================== */
  const login = (email: string, role: "user" | "admin") => {
    const found = users.find(u => u.email === email && u.role === role);
    if (!found) return false;
    if (found.isBlocked) {
      toast.error("Account blocked");
      return false;
    }
    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));
    toast.success("Logged in");
    return true;
  };

  const register = async (data: any) => {
    await registerUser({ ...data, role: "user" });
    await refetchAll();
    toast.success("Registered");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
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
    setUsers(prev => {
  if (!user) return prev;
  return prev.map(u => (u.id === user.id ? updatedUser : u));
});


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
    setIsCartOpen(true); // Auto-open cart sidebar
    toast.success(`Added ${product.name} to cart`);
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
    if (!user) return;

    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return;

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
        vouchers: u.vouchers.filter((v: string) => v !== id),
      });
    }

    await refetchAll();
    toast.success("Voucher deleted");
  };


  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatusAPI(orderId, status);
    await refetchAll();
  };

  /* ===================== WISHLIST ===================== */
  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        await removeFromWishlist(user.id, productId);
        await refetchAll();
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await addToWishlist(user.id, productId);
        await refetchAll();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  /* ===================== CART SIDEBAR ===================== */
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

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
        appliedVoucherId,
        wishlist,
        isCartOpen,
        setAppliedVoucherId,
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
        toggleWishlist,
        isInWishlist,
        openCart,
        closeCart,
        toggleCart,
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