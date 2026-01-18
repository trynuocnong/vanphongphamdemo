import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { isAfter, parseISO, addHours } from "date-fns";
import ProductCard from "@/components/product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getProducts } from "@/services/productService";
import { getOffers, createOffer } from "@/services/offerService";
import { useStore } from "@/lib/store";
import { useRef } from "react";

/* ---------- Review Form Component ---------- */
function ReviewForm({
  initialRating = 0,
  initialComment = "",
  onSubmit,
  onCancel,
  isEditing = false,
}: {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(rating, comment);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(rating)}
              className={`w-6 h-6 transition-colors ${
                value <= (hover || rating)
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {rating > 0 ? `${rating} / 5` : "Click to rate"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
<Textarea
  id={isEditing ? "edit-review-textarea" : undefined}
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  className="w-full border rounded px-3 py-2"
  rows={3}
  placeholder="Write your thoughts..."
  required
/>

      </div>

      <div className="flex gap-2">
        <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
        {isEditing && onCancel && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

/* ---------- Product Detail Page ---------- */
export default function ProductDetail() {
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const { id } = useParams();
  const reviewFormRef = useRef<HTMLDivElement | null>(null);


  const {
    user,
    addToCart,
    orders,
    addFeedback,
    editFeedback,
    deleteFeedback,
    products,   // ✅ Lấy thẳng từ store
  } = useStore();

  const [offers, setOffers] = useState<any[]>([]);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getOffers().then(setOffers);
  }, []);


  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const product = products.find((p) => p.id === id);
  if (!product || product.isDeleted) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  const userId = user?.id;
  const acceptedOffer = userId
    ? offers.find((o) => {
        if (
          o.productId === product.id &&
          o.userId === userId &&
          o.status === "accepted" &&
          o.acceptedAt
        ) {
          const expiry = addHours(parseISO(o.acceptedAt), 24);
          return isAfter(expiry, new Date());
        }
        return false;
      })
    : null;

  const activePrice = acceptedOffer ? acceptedOffer.offerPrice : product.price;

  const relatedProducts = products
    .filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.id !== product.id &&
        !p.isDeleted
    )
    .slice(0, 4);

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login to add product to cart");
      return;
    }
    if (quantity <= 0 || quantity > product.stock) {
      toast.error("Invalid quantity");
      return;
    }
    try {
      await addToCart(product, quantity, activePrice);
      toast.success(`${quantity} x ${product.name} added to cart!`);
      setQuantity(1);
    } catch {
      toast.error("Failed to add to cart.");
    }
  };

  const handleOfferSubmit = async () => {
    if (!userId) {
      toast.error("Please login to make an offer");
      return;
    }
    const price = Number(offerAmount);
    if (!price || price <= 0) {
      toast.error("Invalid price");
      return;
    }
    try {
      await createOffer({
        id: crypto.randomUUID(),
        productId: product.id,
        userId,
        offerPrice: price,
        message: offerMessage,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      toast.success("Offer sent. Seller will review soon.");
      setIsOfferOpen(false);
      setOfferAmount("");
      setOfferMessage("");
    } catch {
      toast.error("Failed to send offer.");
    }
  };

  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const averageRating =
    product.feedbacks?.length > 0
      ? product.feedbacks.reduce((s, f) => s + f.rating, 0) /
        product.feedbacks.length
      : 0;

  return (
    <div className="container px-4 py-10">
      {/* === Product Image & Info === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {displayImages.map((img: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden border relative">
                    <img src={img} alt={`${product.name}`} className="w-full h-full object-cover" />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold border-2 border-white px-4 py-2">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          <div className="grid grid-cols-4 gap-4">
            {displayImages.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedImageIndex(i);
                  carouselApi?.scrollTo(i);
                }}
                className={cn(
                  "aspect-square bg-muted rounded-md overflow-hidden border cursor-pointer transition-all",
                  selectedImageIndex === i
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "hover:border-primary/50"
                )}
              >
                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* === Product Info === */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {product.categoryName || "Category"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center text-yellow-500">
                <Star className="fill-current w-4 h-4" />
                <span className="ml-1 text-foreground font-medium">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span>{product.sold || 0} Sold</span>
              <span>{product.feedbacks?.length || 0} Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">
              {activePrice.toLocaleString()}đ
            </span>
            {acceptedOffer && (
              <Badge className="bg-green-600">Offer Accepted!</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="h-10 w-20 text-center border-0 border-x rounded-none focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

{/* === BUY NOW / OFFER BUTTONS === */}
<div className="flex flex-col gap-4">
  <div className="flex gap-4">
    <Button
      size="lg"
      className="flex-1 h-12 text-lg"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
    >
      {product.stock <= 0
        ? "Out of Stock"
        : acceptedOffer
        ? "Buy Now at Offer Price"
        : "Add to Cart"}
    </Button>

    {/* Nếu có thể offer thì hiển thị dialog */}
    {!acceptedOffer && product.allowOffers && product.stock > 0 && (
      <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-12 text-lg border-primary text-primary hover:bg-primary/5"
          >
            Make an Offer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the price you are willing to pay for{" "}
              <strong>{product.name}</strong>. The seller will review your offer.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Your Offer (VND)
              </label>
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

      {/* === Reviews Section === */}
      <div className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-serif font-bold mb-6">Customer Reviews</h2>

        {/* Average */}
        {product.feedbacks?.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? "fill-current"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} / 5 ({product.feedbacks.length} reviews)
            </p>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
          {product.feedbacks?.length ? (
            product.feedbacks
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((fb) => (
                <div key={fb.id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{fb.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(fb.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < fb.rating ? "fill-current" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">{fb.comment}</p>

                  {user?.id === fb.userId && (
                    <div className="flex gap-2">
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    setEditingReview(fb);
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const textarea = document.querySelector("#edit-review-textarea") as HTMLTextAreaElement;
      textarea?.focus();
    }, 300);
  }}
>
  Edit
</Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteFeedback(product.id, fb.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-muted-foreground italic">No reviews yet.</p>
          )}
        </div>

        {/* Review Form */}
        {user && (() => {
          const canReview = orders.some(
            (o) =>
              o.userId === user.id &&
              o.status.toLowerCase() === "completed" &&
              o.items.some((i) => i.productId === product.id)
          );

          if (!canReview)
            return (
              <p className="text-muted-foreground mt-6">
                You can only review this product after your order is completed.
              </p>
            );

          if (editingReview)
            return (
              <div className="mt-8 border-t pt-6">
                <h4 className="font-semibold text-lg mb-3">
                  Edit Your Review
                </h4>
                <div ref={reviewFormRef}>
  <ReviewForm
    initialRating={editingReview.rating}
    initialComment={editingReview.comment}
    isEditing
    onSubmit={(rating, comment) => {
      editFeedback(product.id, editingReview.id, rating, comment);
      setEditingReview(null);
    }}
    onCancel={() => setEditingReview(null)}
  />
</div>

              </div>
            );

          return (
            <div className="mt-10 border-t pt-6">
              <h4 className="font-semibold text-lg mb-4">
                Write a Review
              </h4>
              <ReviewForm
                onSubmit={(rating, comment) =>
                  addFeedback(product.id, rating, comment)
                }
              />
            </div>
          );
        })()}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-serif font-bold mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
