import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import heroImg from "@assets/generated_images/minimalist_stationery_workspace_hero.png";
import ProductCard from "@/components/product-card";
import ProductQuickView from "@/components/product-quick-view";
import type { Product } from "@/lib/mockData";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";

export default function Home() {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const activeProducts = useMemo(() => products.filter((p) => !p.isDeleted), [products]);

  // 🔍 Search filter
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return activeProducts;
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeProducts]);

  // 🔥 Bán chạy nhất
  const bestsellers = useMemo(() => {
    return [...activeProducts]
      .filter((p) => p.sold > 0)
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
      .slice(0, 4);
  }, [activeProducts]);

  // 🆕 Sản phẩm mới (isNew === true)
  const newArrivals = useMemo(() => {
    return activeProducts.filter((p) => p.isNew).slice(0, 4);
  }, [activeProducts]);

  // 💸 Giảm giá (isSale === true)
  const onSale = useMemo(() => {
    return activeProducts
      .filter(
        (p) =>
          p.isSale === true ||
          (p.originalPrice && p.originalPrice > p.price)
      )
      .slice(0, 4);
  }, [activeProducts]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="relative z-10 max-w-3xl px-4 space-y-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Crafted for
            </span>
            <br />
            <span className="text-foreground">the Modern Mind</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Minimalist stationery, crafted with care and attention to detail
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/collections">
              <Button size="lg" className="text-lg px-8 shadow-xl hover:shadow-2xl transition-all">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="container px-4">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-12 pr-12 h-14 text-lg rounded-full shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Category Showcase */}
      <section className="container px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-primary">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: "Notebooks", emoji: "📓", gradient: "from-blue-500 to-cyan-500", category: "c1" },
            { name: "Writing", emoji: "✒️", gradient: "from-purple-500 to-pink-500", category: "c2" },
            { name: "Desk", emoji: "🗂️", gradient: "from-orange-500 to-red-500", category: "c3" },
            { name: "Paper", emoji: "📄", gradient: "from-green-500 to-teal-500", category: "c4" },
          ].map((cat, idx) => (
            <Link key={idx} href={`/collections?category=${cat.category}`}>
              <div
                className={`group relative h-48 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${cat.gradient} p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                <div className="relative z-10">
                  <div className="text-5xl mb-2">{cat.emoji}</div>
                  <h3 className="text-2xl font-serif font-bold text-white">{cat.name}</h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/50 via-white/80 to-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      {searchTerm ? (
        <ProductSection
          title="Search Results"
          products={filteredProducts}
          onQuickView={setQuickViewProduct}
          showEmptyState
        />
      ) : (
        <>
          {bestsellers.length > 0 && (
            <ProductSection
              title="🔥 Bestsellers"
              products={bestsellers}
              onQuickView={setQuickViewProduct}
              showRanking
            />
          )}
          {newArrivals.length > 0 && (
            <ProductSection
              title="🆕 New Arrivals"
              products={newArrivals}
              onQuickView={setQuickViewProduct}
              showNewBadge
            />
          )}
          {onSale.length > 0 && (
            <ProductSection
              title="💸 On Sale"
              products={onSale}
              onQuickView={setQuickViewProduct}
            />
          )}
        </>
      )}

      {/* Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

function ProductSection({
  title,
  products,
  onQuickView,
  showEmptyState = false,
  showRanking = false,
  showNewBadge = false,
}: {
  title: string;
  products: Product[];
  onQuickView: (product: Product) => void;
  showEmptyState?: boolean;
  showRanking?: boolean;
  showNewBadge?: boolean;
}) {
  if (products.length === 0 && !showEmptyState) return null;

  return (
    <section className="container px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-primary">{title}</h2>
      </div>

      {products.length === 0 && showEmptyState ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or browse our categories
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              showRanking={showRanking}
              ranking={idx + 1}
              showNewBadge={showNewBadge}
            />
          ))}
        </div>
      )}
    </section>
  );
}
