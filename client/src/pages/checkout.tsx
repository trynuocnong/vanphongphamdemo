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
const { cart, checkout, user, vouchers, appliedVoucherId, setAppliedVoucherId } = useStore();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Lấy danh sách địa chỉ của user từ fake API
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3001/addresses?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data);

          // ✅ Tự động chọn địa chỉ mặc định (nếu có)
          const defaultAddr = data.find((a: any) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setShippingData({
              name: defaultAddr.name,
              phone: defaultAddr.phone,
              address: defaultAddr.address,
              city: defaultAddr.city,
              postalCode: defaultAddr.postalCode,
            });
          }
        })
        .catch((err) => console.error("Failed to load addresses:", err));
    }
  }, [user]);

  // Forms setup
  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    formState: { errors: cardErrors },
  } = useForm({ resolver: zodResolver(cardSchema) });

  const {
    register: registerEwallet,
    handleSubmit: handleSubmitEwallet,
    formState: { errors: ewalletErrors },
  } = useForm({ resolver: zodResolver(ewalletSchema) });

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  if (cart.length === 0) return null;

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.priceUsed * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const appliedVoucher = appliedVoucherId ? vouchers.find((v) => v.id === appliedVoucherId) : null;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const onShippingSubmit = () => {
    if (selectedAddressId) {
      const selected = addresses.find((a) => a.id === selectedAddressId);
      if (selected) setShippingData(selected);
    }
    setCurrentStep(2);
  };

  const onPaymentSubmit = () => setCurrentStep(3);

  const handlePlaceOrder = () => {
    if (!shippingData) return;
    checkout({ shippingAddress: shippingData, paymentMethod });
    navigate("/profile");
  };

  return (
    <div className="container px-4 py-8">
      <CheckoutSteps currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SHIPPING */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-serif font-bold">Shipping Information</h2>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Choose a saved address:</p>
                    <div className="grid gap-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setShippingData({
                              name: addr.name,
                              phone: addr.phone,
                              address: addr.address,
                              city: addr.city,
                              postalCode: addr.postalCode,
                            });
                          }}
                          className={`p-4 border rounded-md cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? "border-primary bg-primary/10"
                              : "border-muted hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{addr.name}</div>
                              <div className="text-sm text-muted-foreground">{addr.phone}</div>
                              <div className="text-sm">
                                {addr.address}, {addr.city}, {addr.postalCode}
                              </div>
                            </div>
                            {addr.isDefault && (
                              <span className="text-xs font-semibold text-primary">Default</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-10">
                    You have no saved addresses.
                    <br />
                    <span className="text-sm">
                      Please add one in your <strong>Profile → Addresses</strong> page.
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => navigate("/cart")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                  </Button>
                  <Button disabled={!selectedAddressId} onClick={onShippingSubmit}>
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: PAYMENT */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {["credit_card", "momo", "zalopay", "cod"].map((type) => (
                    <PaymentMethodCard
                      key={type}
                      type={type as PaymentMethodType}
                      selected={paymentMethod === type}
                      onClick={() => setPaymentMethod(type as PaymentMethodType)}
                    />
                  ))}
                </div>

                {paymentMethod === "credit_card" && (
                  <form onSubmit={handleSubmitCard(onPaymentSubmit)} className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold mb-4">Card Details</h3>
                    <div>
                      <Label>Card Number *</Label>
                      <Input {...registerCard("cardNumber")} placeholder="1234567890123456" maxLength={16} />
                      {cardErrors.cardNumber && <p className="text-sm text-destructive">{cardErrors.cardNumber.message as string}</p>}
                    </div>
                    <div>
                      <Label>Cardholder Name *</Label>
                      <Input {...registerCard("cardName")} placeholder="NGUYEN VAN A" />
                      {cardErrors.cardName && <p className="text-sm text-destructive">{cardErrors.cardName.message as string}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry Date *</Label>
                        <Input {...registerCard("expiry")} placeholder="MM/YY" maxLength={5} />
                        {cardErrors.expiry && <p className="text-sm text-destructive">{cardErrors.expiry.message as string}</p>}
                      </div>
                      <div>
                        <Label>CVV *</Label>
                        <Input {...registerCard("cvv")} placeholder="123" maxLength={4} type="password" />
                        {cardErrors.cvv && <p className="text-sm text-destructive">{cardErrors.cvv.message as string}</p>}
                      </div>
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
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
                      <Label>Phone Number *</Label>
                      <Input {...registerEwallet("phone")} placeholder="0901234567" />
                      {ewalletErrors.phone && <p className="text-sm text-destructive">{ewalletErrors.phone.message as string}</p>}
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
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
                        You will pay in cash when your order is delivered.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
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

          {/* STEP 3: REVIEW */}
          {currentStep === 3 && shippingData && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">Review Your Order</h2>

                {/* SHIPPING */}
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

                {/* PAYMENT */}
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

                {/* ORDER ITEMS */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-4 p-3 bg-muted/30 rounded-md">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{(item.priceUsed * item.quantity).toLocaleString()}đ</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VOUCHER */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Apply Voucher
                  </h3>

                  {user?.vouchers && user.vouchers.length > 0 ? (
                    <div className="space-y-2">
                      {user.vouchers
                        .map((id: string) => vouchers.find((v) => v.id === id))
                        .filter(Boolean)
                        .map((v: any) => (
                          <label
                            key={v.id}
                            className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition ${
                              appliedVoucherId === v.id
                                ? "border-primary bg-primary/10"
                                : "hover:bg-muted/50"
                            }`}
onClick={() => setAppliedVoucherId(v.id)}
                          >
                            <div>
                              <p className="font-medium">{v.code}</p>
                              <p className="text-sm text-muted-foreground">{v.description}</p>
                            </div>
                            <span className="font-semibold text-primary">
                              -{v.discount.toLocaleString()}đ
                            </span>
                          </label>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You don’t have any vouchers yet.
                    </p>
                  )}

                  {appliedVoucherId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
onClick={() => setAppliedVoucherId(undefined)}
                    >
                      Remove Voucher
                    </Button>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
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

        {/* SIDEBAR */}
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
