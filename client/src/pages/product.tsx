
import { useParams, Link } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { isAfter, parseISO, addHours } from "date-fns";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart, makeOffer, user, offers, checkOfferBlock } = useStore();
  const { toast } = useToast();
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product || product.isDeleted) return <div className="p-10 text-center">Product not found</div>;

  // Check if user has an accepted offer for this product that is still valid (within 24h)
  const acceptedOffer = user ? offers.find(o => {
    if (o.productId === product.id && o.userId === user.id && o.status === "accepted" && o.acceptedAt) {
      const expiryTime = addHours(parseISO(o.acceptedAt), 24);
      return isAfter(expiryTime, new Date());
    }
    return false;
  }) : null;

  const activePrice = acceptedOffer ? acceptedOffer.offerPrice : product.price;

  // Check offer block status
  const isBlocked = user ? checkOfferBlock(user.id, product.id) : false;

  // Related products (same category, excluding current, not deleted)
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id && !p.isDeleted).slice(0, 4);

  const handleOfferSubmit = () => {
    const price = parseInt(offerAmount);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Invalid price", variant: "destructive" });
      return;
    }
    makeOffer(product.id, price, offerMessage);
    setIsOfferOpen(false);
    setOfferAmount("");
    setOfferMessage("");
  };

  return (
    <div className="container px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden border relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.stock <= 0 && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold border-2 border-white px-4 py-2">OUT OF STOCK</span>
               </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden border cursor-pointer hover:border-primary">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge variant="secondary" className="capitalize">{product.categoryName}</Badge>
               {product.stock > 0 && product.stock < 10 && <Badge variant="destructive">Low Stock: {product.stock}</Badge>}
               {product.stock > 10 && <Badge variant="outline" className="text-green-600 border-green-600">In Stock: {product.stock}</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center text-yellow-500">
                <Star className="fill-current w-4 h-4" />
                <span className="ml-1 text-foreground font-medium">4.8</span>
              </div>
              <span>{product.sold} Sold</span>
              <span>{product.feedbacks.length} Reviews</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
               <span className="text-3xl font-bold text-primary">
                 {activePrice.toLocaleString()}đ
               </span>
               {acceptedOffer && (
                 <Badge className="bg-green-600">Offer Accepted!</Badge>
               )}
               {!acceptedOffer && product.originalPrice && (
                 <span className="text-lg text-muted-foreground line-through">
                   {product.originalPrice.toLocaleString()}đ
                 </span>
               )}
            </div>
            {acceptedOffer && (
               <p className="text-sm text-green-600">Offer price valid for 24 hours from acceptance.</p>
            )}
            {isBlocked && (
              <p className="text-sm text-red-600 font-bold">You are blocked from making offers on this product (Too many rejections).</p>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 h-12 text-lg" 
                onClick={() => addToCart(product, 1, activePrice)}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of Stock" : (acceptedOffer ? "Buy Now at Offer Price" : "Add to Cart")}
              </Button>
              
              {!acceptedOffer && product.allowOffers && product.stock > 0 && (
                <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="flex-1 h-12 text-lg border-primary text-primary hover:bg-primary/5"
                      disabled={isBlocked}
                    >
                      {isBlocked ? "Offer Blocked" : "Make an Offer"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make an Offer</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Enter the price you are willing to pay for <strong>{product.name}</strong>. 
                        The seller will review your offer.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Offer (VND)</label>
                        <Input 
                          type="number" 
                          placeholder="e.g. 120000" 
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message (Optional)</label>
                        <Textarea 
                          placeholder="I really like this item..." 
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleOfferSubmit}>Send Offer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <span>Free shipping over 300k</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-primary" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-serif font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {product.feedbacks.length > 0 ? (
            product.feedbacks.map((fb) => (
              <div key={fb.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{fb.user}</span>
                  <span className="text-xs text-muted-foreground">{fb.date}</span>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < fb.rating ? "fill-current" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-muted-foreground">{fb.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-serif font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Card key={p.id} className="group border-none shadow-none bg-transparent">
                <CardContent className="p-0 relative aspect-square bg-muted mb-4 overflow-hidden rounded-md">
                  <Link href={`/product/${p.id}`}>
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </CardContent>
                <CardFooter className="p-0 block">
                   <Link href={`/product/${p.id}`}>
                    <h3 className="font-medium text-lg leading-none mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                   </Link>
                   <p className="font-semibold">{p.price.toLocaleString()}đ</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
