import { useStore } from "@/lib/store";
import { Tag } from "lucide-react";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

const ITEMS_PER_PAGE = 12;

export default function Sale() {
  const { products } = useStore();
  const { currentPage, setCurrentPage } = usePagination();

  const saleProducts = products
    .filter(
      (p) =>
        !p.isDeleted &&
        (p.isSale ||
          (p.originalPrice && p.originalPrice > p.price))
    )
    .sort(
      (a, b) =>
        (b.originalPrice! - b.price) -
        (a.originalPrice! - a.price)
    );

  const totalPages = Math.ceil(saleProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = saleProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Tag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            On Sale
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Hot deals you don’t want to miss!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showSaleBadge
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
