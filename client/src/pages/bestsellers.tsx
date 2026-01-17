import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function Bestsellers() {
    const { products, addToCart } = useStore();

    // Get bestsellers (sorted by sold count)
    const bestsellers = products
        .filter((p) => !p.isDeleted && p.sold)
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 12);

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

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {bestsellers.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        showRanking={true}
                        ranking={index + 1}
                    />
                ))}
            </div>
        </div>
    );
}
