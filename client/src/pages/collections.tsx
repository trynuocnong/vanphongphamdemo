import { useState, useEffect } from "react";
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
import type { Product } from "@/lib/mockData";

export default function Collections() {
  const { products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [location] = useLocation();

  // ✅ Load categories từ URL query param
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const url = new URL(window.location.href);
    const categoryParam = url.searchParams.get("category");

    if (!categoryParam) {
      setSelectedCategory("all");
      return;
    }

    const exists = categories.some((c) => c.id === categoryParam);
    setSelectedCategory(exists ? categoryParam : "all");
  }, [location, categories]);

  // ✅ Lọc sản phẩm đang hoạt động
  const activeProducts = products.filter((p) => !p.isDeleted);

  // ✅ Tìm kiếm theo tên
  let filteredProducts = activeProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Lọc theo category
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.categoryId === selectedCategory
    );
  }

  // ✅ Sắp xếp
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
} else if (sortBy === "newest") {
  filteredProducts.sort((a, b) => {
    // Ưu tiên isNew = true đứng trước
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // Sau đó sắp xếp theo ngày tạo (mới hơn lên trước)
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Filters */}
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

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={categories.length === 0}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue>
                {selectedCategory === "all"
                  ? "All Categories"
                  : categories.find((c) => c.id === selectedCategory)?.name || "All Categories"}
              </SelectValue>
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

          {/* View Mode Toggle */}
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

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {filteredProducts.length} of {activeProducts.length} products
          </p>
          {(searchTerm || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
              showNewBadge={product.isNew}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
