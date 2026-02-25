import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import ScrollToTop from "./components/ScrollToTop";
// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const location = useLocation();
  const authPaths = ['/login', '/signup', '/verify'];
  const isAuthPage = authPaths.includes(location.pathname);

  const handleCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleWishlistUpdate = () => {
    window.dispatchEvent(new Event('wishlistUpdate'));
  };

  return (
    <div className={`min-h-screen bg-white font-sans text-gray-900 flex flex-col ${!isAuthPage ? 'pb-12' : ''}`}>
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistOpen={() => setIsWishlistOpen(true)}
      />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCartUpdate={handleCartUpdate}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onWishlistUpdate={handleWishlistUpdate}
      />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
