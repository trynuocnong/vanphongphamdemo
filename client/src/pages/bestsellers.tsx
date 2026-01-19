import { useStore } from "@/lib/store";
import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

const ITEMS_PER_PAGE = 12;

export default function Bestsellers() {
  const { products } = useStore();
  const { currentPage, setCurrentPage } = usePagination();

  // 🔥 Lọc & sắp xếp bestseller
  const bestsellers = products
    .filter((p) => !p.isDeleted && (p.sold || 0) > 0)
    .sort((a, b) => (b.sold || 0) - (a.sold || 0));

  const totalPages = Math.ceil(bestsellers.length / ITEMS_PER_PAGE);

  const paginatedProducts = bestsellers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bestsellers
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Our most popular products loved by customers
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            showRanking
            ranking={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
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
