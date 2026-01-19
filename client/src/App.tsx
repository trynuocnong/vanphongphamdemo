import { Switch, Route } from "wouter";
import { StoreProvider } from "@/lib/store";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ReactHotToaster } from "react-hot-toast";

import Home from "@/pages/home";
import ProductDetail from "@/pages/product";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import UserProfile from "@/pages/user-profile";
import OrderHistory from "@/pages/order-history";
import Security from "@/pages/security";
import VoucherCenter from "@/pages/voucher-center";
import Collections from "@/pages/collections";
import Bestsellers from "@/pages/bestsellers";
import NewArrivals from "@/pages/new-arrivals";
import onSale from "@/pages/onSale";

import Contact from "@/pages/contact";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";


import ProtectedRoute from "@/components/ProtectedRoute"; // ✅ thêm

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collections" component={Collections} />
        <Route path="/bestsellers" component={Bestsellers} />
        <Route path="/new-arrivals" component={NewArrivals} />
        <Route path="/onSale" component={onSale} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />

        {/* 🔒 Các trang yêu cầu đăng nhập */}
        <Route path="/checkout">
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        </Route>

        <Route path="/profile">
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        </Route>

        <Route path="/orders">
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        </Route>

        <Route path="/vouchers">
          <ProtectedRoute>
            <VoucherCenter />
          </ProtectedRoute>
        </Route>

        <Route path="/security">
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        </Route>

        <Route path="/admin">
  <ProtectedRoute role="admin">
    <Admin />
  </ProtectedRoute>
</Route>


        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/faq" component={FAQ} />
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <StoreProvider>
      <Router />
      <Toaster />
<ReactHotToaster
  position="bottom-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#363636",
      color: "#fff",
      marginTop: "100px", //DƯỚI HEADER
    },
    success: {
      iconTheme: {
        primary: "#10b981",
        secondary: "#fff",
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>

    </StoreProvider>
  );
}

export default App;
