import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { PaymentMethodCard, PaymentMethodType } from "@/components/checkout/PaymentMethodCard";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const shippingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Phone must be 10-11 digits"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().regex(/^[0-9]{5,6}$/, "Postal code must be 5-6 digits"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const cardSchema = z.object({
    cardNumber: z.string().regex(/^[0-9]{16}$/, "Card number must be 16 digits"),
    cardName: z.string().min(2, "Cardholder name is required"),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Format: MM/YY"),
    cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3-4 digits"),
});

const ewalletSchema = z.object({
    phone: z.string().regex(/^[0-9]{10,11}$/, "Phone must be 10-11 digits"),
});

export default function Checkout() {
    const { cart, checkout, user, vouchers, appliedVoucherId } = useStore();
    const [, navigate] = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");

    // Shipping form
    const {
        register: registerShipping,
        handleSubmit: handleSubmitShipping,
        formState: { errors: shippingErrors },
    } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
            city: "",
            postalCode: "",
        },
    });

    // Payment forms
    const {
        register: registerCard,
        handleSubmit: handleSubmitCard,
        formState: { errors: cardErrors },
    } = useForm({
        resolver: zodResolver(cardSchema),
    });

    const {
        register: registerEwallet,
        handleSubmit: handleSubmitEwallet,
        formState: { errors: ewalletErrors },
    } = useForm({
        resolver: zodResolver(ewalletSchema),
    });

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            navigate("/cart");
        }
    }, [cart, navigate]);

    if (cart.length === 0) {
        return null;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const appliedVoucher = appliedVoucherId ? vouchers.find(v => v.id === appliedVoucherId) : null;
    const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
    const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

    const onShippingSubmit = (data: ShippingFormData) => {
        setShippingData(data);
        setCurrentStep(2);
    };

    const onPaymentSubmit = () => {
        setCurrentStep(3);
    };

    const handlePlaceOrder = () => {
        if (!shippingData) return;

        checkout({
            shippingAddress: shippingData,
            paymentMethod,
        });

        navigate("/profile");
    };

    return (
        <div className="container px-4 py-8">
            <CheckoutSteps currentStep={currentStep} onStepClick={setCurrentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Shipping Information */}
                    {currentStep === 1 && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Shipping Information</h2>
                                <form onSubmit={handleSubmitShipping(onShippingSubmit)} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            {...registerShipping("name")}
                                            placeholder="Nguyen Van A"
                                        />
                                        {shippingErrors.name && (
                                            <p className="text-sm text-destructive mt-1">{shippingErrors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            {...registerShipping("phone")}
                                            placeholder="0901234567"
                                        />
                                        {shippingErrors.phone && (
                                            <p className="text-sm text-destructive mt-1">{shippingErrors.phone.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Street Address *</Label>
                                        <Input
                                            id="address"
                                            {...registerShipping("address")}
                                            placeholder="123 Le Loi Street"
                                        />
                                        {shippingErrors.address && (
                                            <p className="text-sm text-destructive mt-1">{shippingErrors.address.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                {...registerShipping("city")}
                                                placeholder="Ho Chi Minh City"
                                            />
                                            {shippingErrors.city && (
                                                <p className="text-sm text-destructive mt-1">{shippingErrors.city.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="postalCode">Postal Code *</Label>
                                            <Input
                                                id="postalCode"
                                                {...registerShipping("postalCode")}
                                                placeholder="700000"
                                            />
                                            {shippingErrors.postalCode && (
                                                <p className="text-sm text-destructive mt-1">{shippingErrors.postalCode.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button type="button" variant="outline" onClick={() => navigate("/cart")}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Cart
                                        </Button>
                                        <Button type="submit">
                                            Continue to Payment
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Payment Method */}
                    {currentStep === 2 && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Payment Method</h2>

                                <div className="space-y-3 mb-6">
                                    <PaymentMethodCard
                                        type="credit_card"
                                        selected={paymentMethod === "credit_card"}
                                        onClick={() => setPaymentMethod("credit_card")}
                                    />
                                    <PaymentMethodCard
                                        type="momo"
                                        selected={paymentMethod === "momo"}
                                        onClick={() => setPaymentMethod("momo")}
                                    />
                                    <PaymentMethodCard
                                        type="zalopay"
                                        selected={paymentMethod === "zalopay"}
                                        onClick={() => setPaymentMethod("zalopay")}
                                    />
                                    <PaymentMethodCard
                                        type="cod"
                                        selected={paymentMethod === "cod"}
                                        onClick={() => setPaymentMethod("cod")}
                                    />
                                </div>

                                {/* Payment Details Forms */}
                                {paymentMethod === "credit_card" && (
                                    <form onSubmit={handleSubmitCard(onPaymentSubmit)} className="space-y-4 border-t pt-6">
                                        <h3 className="font-semibold mb-4">Card Details</h3>
                                        <div>
                                            <Label htmlFor="cardNumber">Card Number *</Label>
                                            <Input
                                                id="cardNumber"
                                                {...registerCard("cardNumber")}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={16}
                                            />
                                            {cardErrors.cardNumber && (
                                                <p className="text-sm text-destructive mt-1">{cardErrors.cardNumber.message as string}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="cardName">Cardholder Name *</Label>
                                            <Input
                                                id="cardName"
                                                {...registerCard("cardName")}
                                                placeholder="NGUYEN VAN A"
                                            />
                                            {cardErrors.cardName && (
                                                <p className="text-sm text-destructive mt-1">{cardErrors.cardName.message as string}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="expiry">Expiry Date *</Label>
                                                <Input
                                                    id="expiry"
                                                    {...registerCard("expiry")}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                                {cardErrors.expiry && (
                                                    <p className="text-sm text-destructive mt-1">{cardErrors.expiry.message as string}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="cvv">CVV *</Label>
                                                <Input
                                                    id="cvv"
                                                    {...registerCard("cvv")}
                                                    placeholder="123"
                                                    maxLength={4}
                                                    type="password"
                                                />
                                                {cardErrors.cvv && (
                                                    <p className="text-sm text-destructive mt-1">{cardErrors.cvv.message as string}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button type="submit">
                                                Review Order
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {(paymentMethod === "momo" || paymentMethod === "zalopay") && (
                                    <form onSubmit={handleSubmitEwallet(onPaymentSubmit)} className="space-y-4 border-t pt-6">
                                        <h3 className="font-semibold mb-4">
                                            {paymentMethod === "momo" ? "MoMo" : "ZaloPay"} Details
                                        </h3>
                                        <div>
                                            <Label htmlFor="ewalletPhone">Phone Number *</Label>
                                            <Input
                                                id="ewalletPhone"
                                                {...registerEwallet("phone")}
                                                placeholder="0901234567"
                                            />
                                            {ewalletErrors.phone && (
                                                <p className="text-sm text-destructive mt-1">{ewalletErrors.phone.message as string}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button type="submit">
                                                Review Order
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {paymentMethod === "cod" && (
                                    <div className="border-t pt-6">
                                        <div className="bg-muted/50 p-4 rounded-md mb-6">
                                            <p className="text-sm text-muted-foreground">
                                                You will pay in cash when your order is delivered. Please prepare the exact amount.
                                            </p>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button onClick={onPaymentSubmit}>
                                                Review Order
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Review Order */}
                    {currentStep === 3 && shippingData && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-serif font-bold mb-6">Review Your Order</h2>

                                {/* Shipping Info */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        Shipping Information
                                    </h3>
                                    <div className="bg-muted/50 p-4 rounded-md space-y-1 text-sm">
                                        <p><strong>Name:</strong> {shippingData.name}</p>
                                        <p><strong>Phone:</strong> {shippingData.phone}</p>
                                        <p><strong>Address:</strong> {shippingData.address}, {shippingData.city}, {shippingData.postalCode}</p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        Payment Method
                                    </h3>
                                    <div className="bg-muted/50 p-4 rounded-md text-sm">
                                        <p className="capitalize font-medium">
                                            {paymentMethod === "credit_card" && "Credit/Debit Card"}
                                            {paymentMethod === "momo" && "MoMo E-Wallet"}
                                            {paymentMethod === "zalopay" && "ZaloPay"}
                                            {paymentMethod === "cod" && "Cash on Delivery"}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.productId} className="flex gap-4 p-3 bg-muted/30 rounded-md">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold">
                                                    {(item.priceUsed * item.quantity).toLocaleString()}đ
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button onClick={handlePlaceOrder} size="lg" className="min-w-[200px]">
                                        Place Order - {total.toLocaleString()}đ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        items={cart}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        voucherDiscount={voucherDiscount}
                        total={total}
                        appliedVoucherCode={appliedVoucher?.code}
                    />
                </div>
            </div>
        </div>
    );
}
