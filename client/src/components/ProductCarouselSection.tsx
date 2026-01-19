import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/mockData";

export default function ProductCarouselSection({
  title,
  products,
  onQuickView,
}: {
  title: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}) {
  return (
    <section className="container px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-primary">
          {title}
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
        className="relative"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/4"
            >
              <ProductCard
                product={product}
                onQuickView={onQuickView}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* nút chỉ hiện khi cần */}
        <CarouselPrevious className="-left-6" />
        <CarouselNext className="-right-6" />
      </Carousel>
    </section>
  );
}
