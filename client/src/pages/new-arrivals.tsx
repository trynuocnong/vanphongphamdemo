import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

const ITEMS_PER_PAGE = 12;

export default function NewArrivals() {
  const { products } = useStore();
  const { currentPage, setCurrentPage } = usePagination();

  // ✨ Lọc & sắp xếp sản phẩm mới
  const newArrivals = products
    .filter((p) => !p.isDeleted && (p.isNew || p.createdAt))
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

  const totalPages = Math.ceil(newArrivals.length / ITEMS_PER_PAGE);

  const paginatedProducts = newArrivals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showNewBadge
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
