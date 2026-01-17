import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function CartSidebar() {
    const { cart, isCartOpen, closeCart, updateCartQuantity, removeFromCart } = useStore();

    const subtotal = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);
    const freeShippingThreshold = 500000;
    const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={closeCart}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                <h2 className="text-xl font-serif font-bold">Shopping Cart</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeCart}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Free Shipping Progress */}
                        {needsForFreeShipping > 0 && (
                            <div className="px-6 py-4 bg-muted/30">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">
                                        Only <span className="font-semibold text-primary">₫{needsForFreeShipping.toLocaleString()}</span> away from Free Shipping
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${shippingProgress}%` }}
                                        className="h-full bg-gradient-to-r from-primary to-green-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground text-lg">Your cart is empty</p>
                                    <p className="text-sm text-muted-foreground mt-2">Add some amazing products!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.productId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 100 }}
                                            className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                                        >
                                            {/* Image */}
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                                                <p className="text-primary font-bold mt-1">
                                                    ₫{(item.priceUsed * item.quantity).toLocaleString()}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                                                        onClick={() => removeFromCart(item.productId)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t p-6 space-y-4 bg-muted/20">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Subtotal:</span>
                                    <span className="text-primary">₫{subtotal.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Tax included and shipping calculated at checkout
                                </p>

                                <Link href="/checkout">
                                    <Button className="w-full" size="lg" onClick={closeCart}>
                                        <span>Checkout</span>
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link href="/cart" className="mt-[10px] block">
                                    <Button variant="outline" className="w-full" onClick={closeCart}>
                                        View Cart
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
