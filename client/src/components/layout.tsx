
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { ShoppingCart, User, Menu, Search, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";
import CartSidebar from "@/components/cart-sidebar";


export function Layout({ children }: { children: React.ReactNode }) {
  const { user, cart, logout, toggleCart } = useStore();
  const [location, setLocation] = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Stationery.</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/collections" className="hover:text-primary transition-colors">All Products</Link>
              <Link href="/bestsellers" className="hover:text-primary transition-colors">Bestsellers</Link>
              <Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link>
               <Link href="/onSale" className="hover:text-primary transition-colors">On Sale</Link>

            </nav>
          </div>

          <div className="flex items-center gap-4">


            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-serif text-lg">
                      {user.name.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs font-semibold text-primary mt-1">{user.points} Points</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" ? (
                    <DropdownMenuItem onClick={() => setLocation("/admin")}>
                      <Package className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setLocation("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Container>
          {children}
        </Container>
      </main>



      <footer className="border-t bg-muted/30 py-12">
        <div className=" px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold">Stationery.</h3>
              <p className="text-sm text-muted-foreground">Minimalist tools for the modern mind. Crafted with care and attention to detail.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/collections" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/collections?category=c1" className="hover:text-primary transition-colors">Notebooks</Link></li>
                <li><Link href="/collections?category=c2" className="hover:text-primary transition-colors">Writing</Link></li>
                <li><Link href="/collections?category=c3" className="hover:text-primary transition-colors">Desk Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/bestsellers" className="hover:text-primary transition-colors">Bestsellers</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link href="/vouchers" className="hover:text-primary transition-colors">Vouchers</Link></li>
                <li><Link href="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">Subscribe for updates and exclusive offers.</p>
              <div className="flex gap-2">
                <input className="flex-1 h-9 rounded-md border px-3 text-sm" placeholder="Email address" />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Stationery Co. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
