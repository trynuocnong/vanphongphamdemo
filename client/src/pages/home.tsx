
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImg from "@assets/generated_images/minimalist_stationery_workspace_hero.png";

export default function Home() {
  const { products } = useStore();

  const bestsellers = products.sort((a, b) => b.sold - a.sold).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const onSale = products.filter(p => p.isSale).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0 bg-black/20 z-10" />
        
        <div className="relative z-20 space-y-6 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Elevate Your Workspace
          </h1>
          <p className="text-lg text-white/90 md:text-xl font-light">
            Curated stationery for clarity, creativity, and calm.
          </p>
          <div className="flex gap-4 justify-center pt-4">
             <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none">Shop Collection</Button>
             <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">View Lookbook</Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Notebooks", "Writing", "Desk", "Paper"].map((cat) => (
             <div key={cat} className="group relative aspect-square bg-muted overflow-hidden rounded-lg cursor-pointer">
               <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <h3 className="text-xl font-serif font-medium">{cat}</h3>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <ProductSection title="Bestsellers" products={bestsellers} id="bestsellers" />

      {/* New Arrivals */}
      <ProductSection title="New Arrivals" products={newArrivals} id="new" />
      
      {/* Sale */}
      {onSale.length > 0 && (
         <ProductSection title="On Sale" products={onSale} id="sale" />
      )}
    </div>
  );
}

function ProductSection({ title, products, id }: { title: string, products: any[], id: string }) {
  const { addToCart } = useStore();

  return (
    <section id={id} className="container px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-primary">{title}</h2>
        <Link href="/shop" className="text-sm font-medium underline underline-offset-4">View All</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group border-none shadow-none bg-transparent">
            <CardContent className="p-0 relative aspect-square bg-muted mb-4 overflow-hidden rounded-md">
              <Link href={`/product/${product.id}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
              {product.isSale && <Badge variant="destructive" className="absolute top-2 left-2">Sale</Badge>}
            </CardContent>
            <CardFooter className="p-0 block">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-lg leading-none mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                   </Link>
                   <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                </div>
                <div className="text-right">
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through block">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                  <span className="font-semibold">{product.price.toLocaleString()}đ</span>
                </div>
              </div>
              <Button 
                className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                variant="outline"
                onClick={() => addToCart(product, 1)}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
