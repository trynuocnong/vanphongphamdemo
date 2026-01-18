import { useStore } from "@/lib/store";
import { Tag } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function Sale() {
  const { products } = useStore();

  // 💸 Lọc sản phẩm đang giảm giá
  const saleProducts = products
    .filter(
      (p) =>
        !p.isDeleted &&
        (p.isSale === true ||
          (p.originalPrice && p.originalPrice > p.price))
    )
    .sort(
      (a, b) =>
        ((b.originalPrice || 0) - (b.price || 0)) -
        ((a.originalPrice || 0) - (a.price || 0))
    ) // sắp xếp theo mức giảm cao nhất
    .slice(0, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Tag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            On Sale
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Hot deals you don’t want to miss!
        </p>
      </div>

      {saleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} showSaleBadge />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10 italic">
          No sale products available right now.
        </p>
      )}
    </div>
  );
}
