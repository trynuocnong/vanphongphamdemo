import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/mockData";
import { ShoppingCart, X, ArrowRight, Minus, Plus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface ProductQuickViewProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 rounded-full"
                    onClick={onClose}
                >

                </Button>

                <div className="grid md:grid-cols-2 gap-8 pt-6">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.stock < 10 && product.stock > 0 && (
                            <Badge className="absolute top-4 left-4 bg-orange-500">
                                Only {product.stock} left!
                            </Badge>
                        )}
                        {product.stock === 0 && (
                            <Badge className="absolute top-4 left-4 bg-red-500">
                                Out of Stock
                            </Badge>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="space-y-4 flex-1">
                            <div>
                                <h2 className="text-3xl font-serif font-bold mb-2">{product.name}</h2>
                                <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                            </div>

                            <div className="text-3xl font-bold text-primary">
                                ₫{product.price.toLocaleString()}
                            </div>

                            {product.description && (
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">Stock:</span>
                                {product.stock > 10 ? (
                                    <span className="text-green-600">In Stock ({product.stock} available)</span>
                                ) : product.stock > 0 ? (
                                    <span className="text-orange-600">Low Stock ({product.stock} left)</span>
                                ) : (
                                    <span className="text-red-600">Out of Stock</span>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            {product.stock > 0 && (
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">Quantity:</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 text-center font-semibold">{quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1"
                                            size="lg"
                                            onClick={handleAddToCart}
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Link href={`/product/${product.id}`}>
                                            <Button variant="outline" size="lg" onClick={onClose}>
                                                View Full Details
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
