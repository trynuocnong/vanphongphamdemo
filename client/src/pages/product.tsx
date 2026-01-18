import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { isAfter, parseISO, addHours } from "date-fns";
import ProductCard from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Import services theo logic File 1
import { getProducts } from "@/services/productService";
import { getOffers, createOffer } from "@/services/offerService";
import { useStore } from "@/lib/store";
import { Review } from "@/types"; 
export default function ProductDetail() {
  const { id } = useParams();
  const { user, addToCart: addToCartStore } = useStore();

  // --- STATE MANAGEMENT (Theo File 1) ---
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [quantity, setQuantity] = useState(1);

  const userId = user?.id;

  // Fetch data khi component mount
  useEffect(() => {
    getProducts().then(setProducts);
    getOffers().then(setOffers);
  }, []);

  // Sync carousel with thumbnail selection
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

  // --- LOGIC TÍNH TOÁN GIÁ & OFFER (Theo File 1) ---
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

  // Logic sản phẩm liên quan
  const relatedProducts = products
    .filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.id !== product.id &&
        !p.isDeleted
    )
    .slice(0, 4);

  // --- HANDLERS (Async Service Calls) ---

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login to add product to cart");
      return;
    }

    if (quantity <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    try {
      // Gọi store's addToCart để update cả API và state
      await addToCartStore(product, quantity, activePrice);
      toast.success(`${quantity} x ${product.name} added to cart!`);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
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
      // Gọi service createOffer
      await createOffer({
        id: crypto.randomUUID(),
        productId: product.id,
        userId,
        offerPrice: price,
        message: offerMessage,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast.success("Offer sent. Seller will review your offer soon.");
      setIsOfferOpen(false);
      setOfferAmount("");
      setOfferMessage("");
    } catch (error) {
      console.error("Failed to create offer:", error);
      toast.error("Failed to send offer. Please try again.");
    }
  };

  // Safe images array (fallback nếu API chỉ trả về 1 string 'image')
  const displayImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="container px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* === SECTION 1: IMAGES === */}
        <div className="space-y-4">
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {displayImages.map((img: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden border relative">
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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
          {/* Thumbnail list */}
          <div className="grid grid-cols-4 gap-4">
            {displayImages.map((img: string, i: number) => (
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
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION 2: PRODUCT INFO === */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {product.categoryName || "Category"}
              </Badge>
              {product.stock > 0 && product.stock < 10 && (
                <Badge variant="destructive">Low Stock: {product.stock}</Badge>
              )}
              {product.stock >= 10 && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock: {product.stock}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center text-yellow-500">
                <Star className="fill-current w-4 h-4" />
                <span className="ml-1 text-foreground font-medium">4.8</span>
              </div>
              <span>{product.sold || 0} Sold</span>
              <span>{product.feedbacks?.length || 0} Reviews</span>
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
              {/* Nếu đang hiển thị giá gốc (không có offer) thì không cần gạch ngang giá cũ trừ khi bạn có field originalPrice */}
            </div>

            {acceptedOffer && (
              <p className="text-sm text-green-600">
                Offer price valid for 24 hours from acceptance.
              </p>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
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
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(product.stock, Math.max(1, val)));
                }}
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
            <span className="text-sm text-muted-foreground">
              {product.stock} available
            </span>
          </div>

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

              {/* Logic ẩn hiện nút Make Offer giống File 1 */}
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
                        <strong>{product.name}</strong>. The seller will review
                        your offer.
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
                        <label className="text-sm font-medium">
                          Message (Optional)
                        </label>
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

      {/* === SECTION 3: REVIEWS === */}
      <div className="mt-20 max-w-3xl">
  <h2 className="text-2xl font-serif font-bold mb-6">
    Customer Reviews
  </h2>

  <div className="space-y-6">
    {product.reviews && product.reviews.length > 0 ? (
      product.reviews.map((review: Review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">
              {review.userName}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-current"
                    : "text-muted"
                }`}
              />
            ))}
          </div>

          <p className="text-muted-foreground">
            {review.comment}
          </p>
        </div>
      ))
    ) : (
      <p className="text-muted-foreground italic">
        No reviews yet.
      </p>
    )}
  </div>
</div>


      {/* === SECTION 4: RELATED PRODUCTS === */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-serif font-bold mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}