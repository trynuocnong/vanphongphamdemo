import type { Product } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
    showRanking?: boolean;
    ranking?: number;
    showNewBadge?: boolean;
}

export default function ProductCard({
    product,
    onQuickView,
    showRanking,
    ranking,
    showNewBadge
}: ProductCardProps) {
    const { addToCart, toggleWishlist, isInWishlist } = useStore();
    const [isHovered, setIsHovered] = useState(false);
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView?.(product);
    };

    return (
        <Link href={`/product/${product.id}`}>
            <motion.div
                whileHover={{ y: -8 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <Card className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {showNewBadge && (
                                <Badge className="bg-primary">New</Badge>
                            )}
                            {(product.isSale || product.originalPrice) && (
                                <Badge variant="destructive">Sale</Badge>
                            )}
                            {showRanking && ranking && ranking <= 3 && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                    #{ranking} Bestseller
                                </Badge>
                            )}
                            {product.stock <= 0 && (
                                <Badge variant="secondary" className="bg-black/70 text-white">Out of Stock</Badge>
                            )}
                            {product.stock > 0 && product.stock < 10 && (
                                <Badge className="bg-orange-500">Only {product.stock} left</Badge>
                            )}
                        </div>

                        {/* Wishlist Heart - Top Right */}
                        <motion.div
                            className="absolute top-3 right-3"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                className={`rounded-full shadow-lg ${inWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/90 hover:bg-white"
                                    }`}
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                            </Button>
                        </motion.div>

                        {/* Quick Actions - Show on Hover */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-3 left-3 right-3 flex gap-2"
                        >
                            {product.stock > 0 && (
                                <Button
                                    className="flex-1 shadow-lg"
                                    size="sm"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            )}
                            {onQuickView && (
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="shadow-lg"
                                    onClick={handleQuickView}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            )}
                        </motion.div>
                    </div>

                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.categoryName}</p>
                        <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                {product.originalPrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                        ₫{product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                                <span className="text-lg font-bold text-primary">
                                    ₫{product.price.toLocaleString()}
                                </span>
                            </div>
                            {product.sold > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {product.sold} sold
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
}
