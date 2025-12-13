
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, User, Offer, Order, Voucher, PRODUCTS, MOCK_USER, MOCK_ADMIN, VOUCHERS } from "./mockData";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  priceUsed: number; // Could be offer price or regular price
}

interface StoreContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  offers: Offer[];
  vouchers: Voucher[];
  login: (role: "user" | "admin") => void;
  logout: () => void;
  addToCart: (product: Product, quantity: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  checkout: (voucherId?: string) => void;
  makeOffer: (productId: string, price: number) => void;
  respondToOffer: (offerId: string, status: "accepted" | "rejected" | "countered", counterPrice?: number) => void;
  redeemVoucher: (voucherId: string) => void;
  addProduct: (product: Omit<Product, "id" | "sold" | "feedbacks">) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS);
  const { toast } = useToast();

  const login = (role: "user" | "admin") => {
    setUser(role === "admin" ? MOCK_ADMIN : MOCK_USER);
    toast({ title: `Logged in as ${role}` });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast({ title: "Logged out" });
  };

  const addToCart = (product: Product, quantity: number, priceOverride?: number) => {
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
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const checkout = (voucherId?: string) => {
    if (!user) return;
    
    let total = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);
    
    if (voucherId) {
       const voucher = vouchers.find(v => v.id === voucherId);
       if (voucher) {
         total = Math.max(0, total - voucher.discount);
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
      status: "processing",
      date: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    
    // Add points
    const pointsEarned = Math.floor(total / 10000);
    setUser(prev => prev ? ({ ...prev, points: prev.points + pointsEarned }) : null);
    
    toast({ title: "Order placed successfully!", description: `You earned ${pointsEarned} points.` });
  };

  const makeOffer = (productId: string, price: number) => {
    if (!user) {
      toast({ title: "Please login first" });
      return;
    }
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newOffer: Offer = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userId: user.id,
      productName: product.name,
      productImage: product.image,
      originalPrice: product.price,
      offerPrice: price,
      status: "pending",
      date: new Date().toISOString(),
    };
    setOffers(prev => [newOffer, ...prev]);
    toast({ title: "Offer sent to seller" });
  };

  const respondToOffer = (offerId: string, status: "accepted" | "rejected" | "countered", counterPrice?: number) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return { ...o, status, counterPrice };
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
      setUser({ ...user, points: user.points - voucher.pointCost, vouchers: [...user.vouchers, voucher.id] });
      toast({ title: "Voucher redeemed!" });
    } else {
      toast({ title: "Not enough points", variant: "destructive" });
    }
  };
  
  const addProduct = (productData: Omit<Product, "id" | "sold" | "feedbacks">) => {
      const newProduct: Product = {
          ...productData,
          id: Math.random().toString(36).substr(2, 9),
          sold: 0,
          feedbacks: []
      };
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: "Product created" });
  };

  const deleteProduct = (id: string) => {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "Product deleted" });
  };
  
  const updateProduct = (id: string, data: Partial<Product>) => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      toast({ title: "Product updated" });
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        products,
        cart,
        orders,
        offers,
        vouchers,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkout,
        makeOffer,
        respondToOffer,
        redeemVoucher,
        addProduct,
        deleteProduct,
        updateProduct
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
