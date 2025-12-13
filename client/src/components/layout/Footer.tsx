export function Footer() {
  return (
    <footer className="bg-muted/30 border-t py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-lg font-bold mb-4">Stationery Co.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Curated minimalist stationery for the modern creative. 
            Quality materials, timeless design.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">New Arrivals</a></li>
            <li><a href="#" className="hover:text-primary">Best Sellers</a></li>
            <li><a href="#" className="hover:text-primary">Notebooks</a></li>
            <li><a href="#" className="hover:text-primary">Pens & Pencils</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Help Center</a></li>
            <li><a href="#" className="hover:text-primary">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
        © 2025 Stationery Co. All rights reserved.
      </div>
    </footer>
  );
}
