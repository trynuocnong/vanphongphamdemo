import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function NewArrivals() {
  const { products } = useStore();

  // ✨ Lọc theo sản phẩm mới hoặc có ngày tạo gần nhất
  const newArrivals = products
    .filter((p) => !p.isDeleted && (p.isNew || p.createdAt))
    .sort(
      (a, b) =>
        (b.isNew === a.isNew
          ? new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          : b.isNew ? 1 : -1)
    )
    .slice(0, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            New Arrivals
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Fresh additions to our collection
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} showNewBadge />
        ))}
      </div>
    </div>
  );
}
