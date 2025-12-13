
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Tag, Gift, Clock } from "lucide-react";
import { Redirect } from "wouter";

export default function Profile() {
  const { user, orders, offers, vouchers, redeemVoucher } = useStore();

  if (!user) return <Redirect to="/login" />;

  const myOrders = orders.filter(o => o.userId === user.id);
  const myOffers = offers.filter(o => o.userId === user.id);
  const myVoucherIds = user.vouchers || [];

  return (
    <div className="container px-4 py-10">
      <div className="flex items-center gap-6 mb-10">
        <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-serif">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm font-medium">
            <Gift className="w-4 h-4" />
            {user.points} Points Available
          </div>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="vouchers">Voucher Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {myOrders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet.</p>
              ) : (
                myOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <div>
                         <span className="font-mono text-sm">#{order.id}</span>
                         <span className="mx-2 text-muted-foreground">•</span>
                         <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                       </div>
                       <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                         {order.status}
                       </Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2 font-bold">
                      <span>Total</span>
                      <span>{order.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>My Offers</CardTitle>
              <CardDescription>Track status of your price offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myOffers.length === 0 ? (
                <p className="text-muted-foreground">No active offers.</p>
              ) : (
                myOffers.map(offer => (
                  <div key={offer.id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-muted rounded overflow-hidden">
                        <img src={offer.productImage} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{offer.productName}</h4>
                        <div className="text-sm space-y-1 mt-1">
                          <p className="text-muted-foreground line-through">{offer.originalPrice.toLocaleString()}đ</p>
                          <p className="font-bold text-primary">Your Offer: {offer.offerPrice.toLocaleString()}đ</p>
                          {offer.status === "countered" && (
                            <p className="text-orange-600 font-bold">Counter Offer: {offer.counterPrice?.toLocaleString()}đ</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Badge className={
                        offer.status === "accepted" ? "bg-green-600" : 
                        offer.status === "rejected" ? "bg-red-600" : 
                        offer.status === "countered" ? "bg-orange-500" : "bg-gray-500"
                      }>
                        {offer.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouchers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
               <CardHeader><CardTitle>My Vouchers</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 {myVoucherIds.length === 0 ? <p className="text-muted-foreground">No vouchers.</p> : (
                   myVoucherIds.map(vid => {
                     const v = vouchers.find(vo => vo.id === vid);
                     if(!v) return null;
                     return (
                       <div key={vid} className="flex justify-between items-center border p-3 rounded bg-muted/20">
                         <div>
                           <p className="font-bold text-primary">{v.code}</p>
                           <p className="text-xs text-muted-foreground">{v.description}</p>
                         </div>
                         <div className="text-right">
                           <p className="font-bold">-{v.discount.toLocaleString()}đ</p>
                           <p className="text-xs">Min: {v.minSpend.toLocaleString()}đ</p>
                         </div>
                       </div>
                     )
                   })
                 )}
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Redeem Points</CardTitle>
                 <CardDescription>Use your points to get more vouchers</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {vouchers.filter(v => v.pointCost > 0).map(v => (
                   <div key={v.id} className="flex justify-between items-center border p-3 rounded">
                      <div>
                        <p className="font-bold">{v.description}</p>
                        <p className="text-sm text-primary font-medium">{v.pointCost} Points</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={user.points < v.pointCost || user.vouchers.includes(v.id)}
                        onClick={() => redeemVoucher(v.id)}
                      >
                        {user.vouchers.includes(v.id) ? "Owned" : "Redeem"}
                      </Button>
                   </div>
                 ))}
               </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
