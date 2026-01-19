import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/product-card";
import ProductQuickView from "@/components/product-quick-view";
import Pagination from "@/components/pagination"; // ✅ component chung
import type { Product } from "@/lib/mockData";

const PAGE_SIZE = 12;

export default function Collections() {
  const { products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [location, setLocation] = useLocation();

  /* =======================
     PAGINATION STATE
  ======================= */
  const url = new URL(window.location.href);
  const initialPage = Number(url.searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  /* =======================
     LOAD CATEGORY FROM URL
  ======================= */
  useEffect(() => {
    if (!categories.length) return;

    const categoryParam = url.searchParams.get("category");
    if (!categoryParam) {
      setSelectedCategory("all");
      return;
    }

    const exists = categories.some((c) => c.id === categoryParam);
    setSelectedCategory(exists ? categoryParam : "all");
  }, [location, categories]);

  /* =======================
     FILTER + SORT
  ======================= */
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => !p.isDeleted);

    if (searchTerm.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        });
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  /* =======================
     RESET PAGE WHEN FILTER CHANGES
  ======================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  /* =======================
     PAGINATION LOGIC
  ======================= */
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  /* =======================
     SYNC PAGE TO URL
  ======================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(currentPage));
    setLocation(`/collections?${params.toString()}`, { replace: true });
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {selectedCategory === "all"
            ? "All Products"
            : `${categories.find((c) => c.id === selectedCategory)?.name || ""} Collection`}
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover our complete collection of premium stationery
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "large" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("large")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No products found</h3>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                showNewBadge={product.isNew}
              />
            ))}
          </div>

          {/* ✅ PAGINATION */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* ================= QUICK VIEW ================= */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
