
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, User, Offer, Order, Voucher, Category, PRODUCTS, MOCK_USERS, VOUCHERS, CATEGORIES } from "./mockData";
import toast from "react-hot-toast";
import { addDays, isAfter, parseISO } from "date-fns";
import { createOrder as createOrderAPI, getOrders as getOrdersAPI, updateOrderStatus as updateOrderStatusAPI } from "@/services/orderService";
import { addToCart as addToCartAPI, getCartItems as getCartItemsAPI, updateCartItem as updateCartItemAPI, removeCartItem as removeCartItemAPI, clearUserCart as clearUserCartAPI } from "@/services/cartService";
import { getUsers as getUsersAPI, registerUser as registerUserAPI, updateUser as updateUserAPI, deleteUser as deleteUserAPI } from "@/services/userService";
import { getProducts as getProductsAPI, addProduct as addProductAPI, updateProduct as updateProductAPI, deleteProduct as deleteProductAPI } from "@/services/productService";
import { getVouchers as getVouchersAPI, addVoucher as addVoucherAPI, updateVoucher as updateVoucherAPI, deleteVoucher as deleteVoucherAPI } from "@/services/voucherService";
import { getOffers as getOffersAPI, createOffer as createOfferAPI, respondToOffer as respondToOfferAPI } from "@/services/offerService";

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
  appliedVoucherId: string | undefined;
  setAppliedVoucherId: (id: string | undefined) => void;
  login: (email: string, role: "user" | "admin") => boolean;
  register: (user: Omit<User, "id" | "points" | "vouchers" | "role">) => void;
  resetPassword: (email: string) => void;
  logout: () => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addToCart: (product: Product, quantity: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  checkout: (data: {
    voucherId?: string;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    paymentMethod: "credit_card" | "momo" | "zalopay" | "cod";
  }) => void;

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
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | undefined>();

  // Load all data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load orders
        const ordersData = await getOrdersAPI();
        setOrders(ordersData);

        // Load users
        const usersData = await getUsersAPI();
        setUsers(usersData);

        // Load products
        const productsData = await getProductsAPI();
        setProducts(productsData);

        // Load vouchers
        const vouchersData = await getVouchersAPI();
        setVouchers(vouchersData);

        // Load offers
        const offersData = await getOffersAPI();
        setOffers(offersData);
      } catch (error) {
        console.error("Failed to load data from API:", error);
      }
    };
    loadData();
  }, []);

  // Load cart from API when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const cartData = await getCartItemsAPI(user.id);
        // Transform API cart data to match CartItem interface
        const transformedCart: CartItem[] = cartData.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: products.find(p => p.id === item.productId) || {} as Product,
          priceUsed: item.price,
        })).filter((item: CartItem) => item.product.id); // Filter out items with missing products
        setCart(transformedCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };
    loadCart();
  }, [user, products]);

  const login = (email: string, role: "user" | "admin") => {
    // Simple mock login
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      if (foundUser.isBlocked) {
        toast.error("Account Blocked. Please contact support.");
        return false;
      }
      setUser(foundUser);
      toast.success(`Logged in as ${role}`);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, "id" | "points" | "vouchers" | "role">) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      points: 0,
      vouchers: ["v1"], // Welcome voucher
      password: userData.password || "", // Ensure password is always a string
    };
    try {
      await registerUserAPI({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || "",
        role: newUser.role,
      });
      // Add the complete user to local state
      setUsers(prev => [...prev, newUser]);
      toast.success("Account created successfully. You can now login.");
    } catch (error) {
      console.error("Failed to register user:", error);
      toast.error("Registration failed");
    }
  };

  const resetPassword = (email: string) => {
    // Mock reset
    const exists = users.find(u => u.email === email);
    if (exists) {
      toast.success("Password Reset Email Sent. Check your inbox for instructions.");
    } else {
      toast.error("Email not found");
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast.success("Logged out");
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      const updatedUser = await updateUserAPI(id, { ...users.find(u => u.id === id), ...data });
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (user && user.id === id) {
        setUser(prev => prev ? { ...prev, ...data } : null);
      }
      toast.success("User updated");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Update failed");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteUserAPI(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Delete failed");
    }
  };

  const addToCart = async (product: Product, quantity: number, priceOverride?: number) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (product.stock < quantity) {
      toast.error("Not enough stock");
      return;
    }

    try {
      await addToCartAPI(user.id, product, quantity, priceOverride);

      // Update local state
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { productId: product.id, quantity, product, priceUsed: priceOverride || product.price }];
      });
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      // Find the cart item in db.json to get its ID
      const cartData = await getCartItemsAPI(user.id);
      const cartItem = cartData.find((item: any) => item.productId === productId);

      if (cartItem) {
        await removeCartItemAPI(cartItem.id);
      }

      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && product.stock < quantity) {
      toast.error(`Only ${product.stock} available`);
      return;
    }

    try {
      // Find the cart item in db.json to get its ID
      const cartData = await getCartItemsAPI(user.id);
      const cartItem = cartData.find((item: any) => item.productId === productId);

      if (cartItem) {
        await updateCartItemAPI(cartItem.id, quantity);
      }

      setCart((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update quantity");
    }
  };

  const checkout = async (data: {
    voucherId?: string;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    paymentMethod: "credit_card" | "momo" | "zalopay" | "cod";
  }) => {
    if (!user) return;

    let subtotal = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);

    // Calculate shipping fee: free for orders over 500k, otherwise 30k
    const shippingFee = subtotal >= 500000 ? 0 : 30000;

    // Check if any item uses an offer price - if so, voucher logic might change
    const hasOfferPrice = cart.some(item => item.priceUsed < item.product.price);

    let voucherDiscount = 0;
    if (data.voucherId) {
      if (hasOfferPrice) {
        toast.error("Voucher ignored. Vouchers cannot be combined with offer prices.");
      } else {
        const voucher = vouchers.find(v => v.id === data.voucherId);
        if (voucher) {
          voucherDiscount = voucher.discount;
        }
      }
    }

    const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

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
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      shippingFee,
      voucherDiscount,
    };

    try {
      // Persist order to database
      const savedOrder = await createOrderAPI(newOrder);

      // Update stock
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(c => c.productId === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity, sold: p.sold + cartItem.quantity };
        }
        return p;
      }));

      setOrders((prev) => [savedOrder, ...prev]);

      // Clear cart from database
      await clearUserCartAPI(user.id);
      setCart([]);

      // Add points regardless of offer usage
      const pointsEarned = Math.floor(total / 10000);
      updateUser(user.id, { points: user.points + pointsEarned });

      toast.success(`Order placed successfully! You earned ${pointsEarned} points.`);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Order failed. Please try again.");
    }
  };

  const checkOfferBlock = (userId: string, productId: string) => {
    const rejectedCount = offers.filter(o =>
      o.userId === userId &&
      o.productId === productId &&
      o.status === "rejected"
    ).length;
    return rejectedCount >= 5;
  };

  const makeOffer = async (productId: string, price: number, message?: string) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (checkOfferBlock(user.id, productId)) {
      toast.error("Offer Blocked. You have exceeded the maximum number of rejected offers for this product.");
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!product.allowOffers) {
      toast.error("Offers not allowed for this product");
      return;
    }

    let status: Offer["status"] = "pending";
    let acceptedAt = undefined;

    // Auto Accept Logic
    if (product.autoAcceptPrice && price >= product.autoAcceptPrice) {
      status = "accepted";
      acceptedAt = new Date().toISOString();
      toast.success("Offer instantly accepted! You can now buy at this price.");
    }
    // Auto Reject Logic
    else if (product.autoRejectPrice && price < product.autoRejectPrice) {
      status = "rejected";
      toast.error("Offer rejected. Price is too low.");
    } else {
      toast.success("Offer sent to seller");
    }

    const newOffer = {
      productId,
      userId: user.id,
      offerPrice: price,
      message,
    };

    try {
      const savedOffer = await createOfferAPI(newOffer);
      setOffers(prev => [savedOffer, ...prev]);
    } catch (error) {
      console.error("Failed to create offer:", error);
      toast.error("Failed to create offer");
    }
  };

  const respondToOffer = async (offerId: string, status: "accepted" | "rejected" | "countered", counterPrice?: number) => {
    try {
      await respondToOfferAPI(offerId, status as "accepted" | "rejected");
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
      toast.success(`Offer ${status}`);
    } catch (error) {
      console.error("Failed to respond to offer:", error);
      toast.error("Failed to respond to offer");
    }
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
      toast.success("Voucher redeemed!");
    } else {
      toast.error("Not enough points");
    }
  };

  // Products CRUD
  const addProduct = async (productData: Omit<Product, "id" | "sold" | "feedbacks" | "createdAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      sold: 0,
      feedbacks: [],
      createdAt: new Date().toISOString(),
    };
    try {
      const savedProduct = await addProductAPI(newProduct);
      setProducts(prev => [savedProduct, ...prev]);
      toast.success("Product created");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to create product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductAPI(id);
      // Soft delete in local state
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true } : p));
      toast.success("Product removed from listing");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const updatedProduct = await updateProductAPI(id, { ...products.find(p => p.id === id), ...data });
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success("Product updated");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    }
  };

  // Categories CRUD
  const addCategory = (data: Omit<Category, "id">) => {
    const newCat = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCat]);
    toast.success("Category added");
  };
  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success("Category updated");
  };
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success("Category deleted");
  };

  // Vouchers CRUD
  const addVoucher = async (data: Omit<Voucher, "id">) => {
    const newVoucher = { ...data, id: Math.random().toString(36).substr(2, 9) };
    try {
      const savedVoucher = await addVoucherAPI(newVoucher);
      setVouchers(prev => [...prev, savedVoucher]);
      toast.success("Voucher added");
    } catch (error) {
      console.error("Failed to add voucher:", error);
      toast.error("Failed to add voucher");
    }
  };
  const updateVoucher = async (id: string, data: Partial<Voucher>) => {
    try {
      const updatedVoucher = await updateVoucherAPI(id, { ...vouchers.find(v => v.id === id), ...data });
      setVouchers(prev => prev.map(v => v.id === id ? updatedVoucher : v));
      toast.success("Voucher updated");
    } catch (error) {
      console.error("Failed to update voucher:", error);
      toast.error("Failed to update voucher");
    }
  };
  const deleteVoucher = async (id: string) => {
    try {
      await deleteVoucherAPI(id);
      setVouchers(prev => prev.filter(v => v.id !== id));
      toast.success("Voucher deleted");
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      toast.error("Failed to delete voucher");
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatusAPI(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Update failed");
    }
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
    toast.success("Review submitted. Thank you for your feedback!");
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
    toast.success("Feedback deleted");
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
        appliedVoucherId,
        setAppliedVoucherId,
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
