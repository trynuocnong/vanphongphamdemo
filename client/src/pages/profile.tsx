
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Gift, User as UserIcon, Lock, MapPin, Phone, Star } from "lucide-react";
import { Redirect, Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
const {
  user,
  authReady,
  updateUser,
  orders,
  offers,
  vouchers,
  redeemVoucher,
  addFeedback,
} = useStore();
if (!authReady) {
  return (
    <div className="container px-4 py-10 text-muted-foreground">
      Loading profile...
    </div>
  );
}

if (!user) return <Redirect to="/login" />;

  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reviewProduct, setReviewProduct] = useState<any>(null); // Product to review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!user) return <Redirect to="/login" />;

  const myOrders = orders.filter(o => o.userId === user.id);
  const myOffers = offers.filter(o => o.userId === user.id);
  const myVoucherIds = user.vouchers || [];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateUser(user.id, {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    });
  };

const handleChangePassword = () => {
  if (!newPassword) {
    toast({ title: "New password is required", variant: "destructive" });
    return;
  }

  updateUser(user.id, { password: newPassword });
  setPassword("");
  setNewPassword("");
  toast({ title: "Password changed successfully" });
};


  const handleSubmitReview = () => {
    if (reviewProduct) {
      addFeedback(reviewProduct.productId, rating, comment);
      setReviewProduct(null);
      setRating(5);
      setComment("");
    }
  };

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
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                       <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>
                         {order.status.toUpperCase()}
                       </Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                             <span>{item.quantity}x {item.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                             <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                             {order.status === "completed" && (
                               <Button 
                                 size="sm" 
                                 variant="outline" 
                                 className="h-7 text-xs"
                                 onClick={() => setReviewProduct(item)}
                               >
                                 Review
                               </Button>
                             )}
                          </div>
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
                          {offer.message && <p className="text-xs italic text-muted-foreground">"{offer.message}"</p>}
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
          <div className="space-y-6">
             <Card>
               <CardHeader><CardTitle>My Vouchers Wallet</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 {myVoucherIds.length === 0 ? <p className="text-muted-foreground">No vouchers.</p> : (
                   myVoucherIds.map(vid => {
                     const v = vouchers.find(vo => vo.id === vid);
                     if(!v) return null;
                     return (
                       <div key={vid} className="border p-4 rounded-lg bg-muted/20 space-y-2">
                         <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                             <TicketIcon className="w-5 h-5 text-primary" />
                             <span className="font-bold text-lg">{v.code}</span>
                           </div>
                           <Badge variant="outline">-{v.discount.toLocaleString()}đ</Badge>
                         </div>
                         <p className="text-sm text-muted-foreground">{v.description}</p>
                         <div className="text-xs bg-background p-2 rounded border">
                            <strong>Conditions:</strong> {v.detailedConditions}
                         </div>
                       </div>
                     )
                   })
                 )}
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Rewards Center</CardTitle>
                 <CardDescription>Redeem your points for vouchers</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {vouchers.filter(v => v.pointCost > 0).map(v => (
                   <div key={v.id} className="flex justify-between items-center border p-4 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-bold">{v.description}</p>
                        <p className="text-sm text-primary font-medium">{v.pointCost} Points</p>
                        <p className="text-xs text-muted-foreground max-w-md">{v.detailedConditions}</p>
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

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input name="name" defaultValue={user.name} className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input value={user.email} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input name="phone" defaultValue={user.phone} placeholder="Enter phone number" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input name="address" defaultValue={user.address} placeholder="Enter shipping address" className="pl-9" />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">Current Password</label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-9" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">New Password</label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pl-9" />
                   </div>
                </div>
                <Button onClick={handleChangePassword} variant="outline">Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewProduct} onOpenChange={(open) => !open && setReviewProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Reviewing: <strong>{reviewProduct?.name}</strong>
            </p>
            <div className="space-y-2">
               <label className="text-sm font-medium">Rating</label>
               <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <Star 
                     key={star} 
                     className={`w-6 h-6 cursor-pointer ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                     onClick={() => setRating(star)}
                   />
                 ))}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Comment</label>
               <Textarea 
                 placeholder="Tell us what you liked..." 
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
               />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TicketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}
