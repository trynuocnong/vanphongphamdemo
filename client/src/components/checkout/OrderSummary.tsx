import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CartItem {
    productId: string;
    quantity: number;
    product: {
        name: string;
        image: string;
        price: number;
    };
    priceUsed: number;
}

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    voucherDiscount: number;
    total: number;
    appliedVoucherCode?: string;
}

export function OrderSummary({
    items,
    subtotal,
    shippingFee,
    voucherDiscount,
    total,
    appliedVoucherCode
}: OrderSummaryProps) {
    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="font-serif">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-sm font-semibold mt-1">
                                    {(item.priceUsed * item.quantity).toLocaleString()}đ
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{subtotal.toLocaleString()}đ</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Fee</span>
                        <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                            {shippingFee === 0 ? "FREE" : `${shippingFee.toLocaleString()}đ`}
                        </span>
                    </div>

                    {voucherDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span className="flex items-center gap-2">
                                Voucher
                                {appliedVoucherCode && (
                                    <Badge variant="secondary" className="text-xs">
                                        {appliedVoucherCode}
                                    </Badge>
                                )}
                            </span>
                            <span>-{voucherDiscount.toLocaleString()}đ</span>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()}đ</span>
                </div>

                {/* Points Info */}
                <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground text-center">
                        You will earn <span className="font-semibold text-foreground">{Math.floor(total / 10000)} points</span> with this order
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
