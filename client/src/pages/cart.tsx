
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowRight, Ticket } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, user, vouchers, appliedVoucherId, setAppliedVoucherId } = useStore();
  const [, navigate] = useLocation();
  const [voucherCode, setVoucherCode] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);

  // Auto-apply best voucher logic could go here, but let's stick to manual for now
  const appliedVoucher = appliedVoucherId ? vouchers.find(v => v.id === appliedVoucherId) : null;
  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyVoucher = () => {
    const voucher = vouchers.find(v => v.code === voucherCode);
    if (voucher) {
      if (subtotal >= voucher.minSpend) {
        setAppliedVoucherId(voucher.id);
      } else {
        alert(`Minimum spend of ${voucher.minSpend.toLocaleString()} required`);
      }
    } else {
      alert("Invalid voucher code");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-serif">Your cart is empty</h2>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4 py-4 border-b">
              <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.product.categoryName}</p>
                    {item.priceUsed < item.product.price && (
                      <span className="text-xs text-green-600 font-medium">Offer Price Applied</span>
                    )}
                  </div>
                  <p className="font-bold">{(item.priceUsed * item.quantity).toLocaleString()}đ</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline" size="icon" className="h-8 w-8"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline" size="icon" className="h-8 w-8"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-serif text-xl font-bold">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-green-600">
                    <span>Voucher ({appliedVoucher.code})</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
              </div>

              {/* Voucher Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Voucher Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyVoucher}>Apply</Button>
              </div>

              {user && user.vouchers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Your Vouchers:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.vouchers.map(vid => {
                      const v = vouchers.find(v => v.id === vid);
                      if (!v) return null;
                      return (
                        <Badge
                          key={vid}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => { setVoucherCode(v.code); }}
                        >
                          {v.code}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              <Button className="w-full h-12 text-lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You will earn {Math.floor(total / 10000)} points with this order.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
