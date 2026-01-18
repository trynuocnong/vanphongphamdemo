import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Clock, CheckCircle2, XCircle, ShoppingCart, MapPin, CreditCard, Download, RotateCcw } from "lucide-react";
import { format } from "date-fns";

type OrderStatus = "all" | "pending" | "shipping" | "completed" | "cancelled";

interface OrderItemProps {
  order: any;
  onClick: () => void;
}

function OrderCard({ order, onClick }: OrderItemProps) {
  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Pending" },
    shipping: { icon: Package, color: "text-blue-600 bg-blue-50 border-blue-200", label: "Shipping" },
    completed: { icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200", label: "Completed" },
    cancelled: { icon: XCircle, color: "text-red-600 bg-red-50 border-red-200", label: "Cancelled" },
  };

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none bg-gradient-to-br from-white to-gray-50/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order #{order.id.toUpperCase()}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(order.date), "MMM dd, yyyy • HH:mm")}
            </CardDescription>
          </div>
          <Badge className={`${config.color} flex items-center gap-1.5 px-3 py-1.5 border`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </div>
              <span className="font-semibold">{item.price.toLocaleString()}đ</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-sm text-muted-foreground italic pl-4">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-[200px]">{order.shippingAddress.city}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Total</div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {order.total.toLocaleString()}đ
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="flex-1">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            Track
          </Button>
          {order.status === "completed" && (
            <Button variant="outline" size="sm" className="flex-1">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reorder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderDetailDialog({ order, open, onClose }: { order: any; open: boolean; onClose: () => void }) {
  if (!order) return null;

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", label: "Pending" },
    shipping: { icon: Package, color: "text-blue-600", label: "Shipping" },
    completed: { icon: CheckCircle2, color: "text-green-600", label: "Completed" },
    cancelled: { icon: XCircle, color: "text-red-600", label: "Cancelled" },
  };

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  // Order timeline based on status
  const getTimeline = () => {
    const baseSteps = [
      { label: "Order Placed", completed: true, date: order.date },
      { label: "Processing", completed: order.status !== "cancelled", date: order.date },
      { label: "Shipping", completed: ["shipping", "completed"].includes(order.status), date: order.status === "shipping" || order.status === "completed" ? order.date : null },
      { label: "Delivered", completed: order.status === "completed", date: order.status === "completed" ? order.date : null },
    ];
    
    if (order.status === "cancelled") {
      return [...baseSteps.slice(0, 1), { label: "Cancelled", completed: true, date: order.date }];
    }
    
    return baseSteps;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.toUpperCase()}</span>
            <Badge className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
              <StatusIcon className="h-4 w-4" />
              {config.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {format(new Date(order.date), "MMMM dd, yyyy 'at' HH:mm")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Order Timeline */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Timeline
              </h3>
              <div className="relative">
                {getTimeline().map((step, idx) => (
                  <div key={idx} className="flex gap-4 pb-6 last:pb-0 relative">
                    {idx < getTimeline().length - 1 && (
                      <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${
                        step.completed ? "bg-green-500" : "bg-gray-200"
                      }`} />
                    )}
                    <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.completed 
                        ? "border-green-500 bg-green-500 text-white" 
                        : "border-gray-300 bg-white text-gray-400"
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(step.date), "MMM dd, yyyy HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-white flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.price.toLocaleString()}đ</p>
                      <p className="text-sm text-muted-foreground">each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Summary
              </h3>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{(order.total - (order.shippingFee || 0) + (order.voucherDiscount || 0)).toLocaleString()}đ</span>
                </div>
                {order.voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Voucher Discount</span>
                    <span>-{order.voucherDiscount.toLocaleString()}đ</span>
                  </div>
                )}
                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping Fee</span>
                    <span>{order.shippingFee.toLocaleString()}đ</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {order.total.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">{order.paymentMethod?.replace("_", " ") || "Cash on Delivery"}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {order.status === "completed" && (
            <>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reorder
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OrderHistory() {
  const { orders, user } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter orders by current user and status
  const userOrders = orders.filter((order) => order.userId === user?.id);
  
  const filteredOrders = selectedStatus === "all" 
    ? userOrders 
    : userOrders.filter((order) => order.status === selectedStatus);

  const statusCounts = {
    all: userOrders.length,
    pending: userOrders.filter((o) => o.status === "pending").length,
    shipping: userOrders.filter((o) => o.status === "shipping").length,
    completed: userOrders.filter((o) => o.status === "completed").length,
    cancelled: userOrders.filter((o) => o.status === "cancelled").length,
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Order History
        </h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" className="space-y-6" onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <div className="flex flex-col items-center gap-1 py-2">
              <span>All</span>
              <Badge variant="secondary" className="min-w-[24px] justify-center">
                {statusCounts.all}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <div className="flex flex-col items-center gap-1 py-2">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
              <Badge variant="secondary" className="min-w-[24px] justify-center">
                {statusCounts.pending}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <div className="flex flex-col items-center gap-1 py-2">
              <Package className="h-4 w-4" />
              <span>Shipping</span>
              <Badge variant="secondary" className="min-w-[24px] justify-center">
                {statusCounts.shipping}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <div className="flex flex-col items-center gap-1 py-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed</span>
              <Badge variant="secondary" className="min-w-[24px] justify-center">
                {statusCounts.completed}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <div className="flex flex-col items-center gap-1 py-2">
              <XCircle className="h-4 w-4" />
              <span>Cancelled</span>
              <Badge variant="secondary" className="min-w-[24px] justify-center">
                {statusCounts.cancelled}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground text-center">
                  {selectedStatus === "all" 
                    ? "You haven't placed any orders yet" 
                    : `You don't have any ${selectedStatus} orders`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredOrders
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((order) => (
                  <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      <OrderDetailDialog 
        order={selectedOrder} 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      />
    </div>
  );
}
