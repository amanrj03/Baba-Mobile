import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, LogOut, ShoppingBag } from "lucide-react";
import logo from "../assets/logo.png";
import { cartAPI, productAPI } from "../services/api";

const Navbar = ({ onCartOpen, onWishlistOpen }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
        fetchCounts();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    const handleOpenCart = () => {
      if (onCartOpen) onCartOpen();
    };

    const handleOpenWishlist = () => {
      if (onWishlistOpen) onWishlistOpen();
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab login/logout
    window.addEventListener('authChange', checkAuth);
    
    // Custom event for cart/wishlist updates
    window.addEventListener('cartUpdate', fetchCounts);
    window.addEventListener('wishlistUpdate', fetchCounts);
    
    // Custom events to open drawers
    window.addEventListener('openCart', handleOpenCart);
    window.addEventListener('openWishlist', handleOpenWishlist);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('cartUpdate', fetchCounts);
      window.removeEventListener('wishlistUpdate', fetchCounts);
      window.removeEventListener('openCart', handleOpenCart);
      window.removeEventListener('openWishlist', handleOpenWishlist);
    };
  }, [onCartOpen, onWishlistOpen]);

  const fetchCounts = async () => {
    try {
      const [cartResponse, wishlistResponse] = await Promise.all([
        cartAPI.getCart().catch(() => ({ data: { items: [] } })),
        productAPI.getWishlist().catch(() => ({ data: [] }))
      ]);
      
      const cartItems = cartResponse.data.items || [];
      const wishlistItems = wishlistResponse.data.results || wishlistResponse.data || [];
      
      setCartCount(cartItems.length);
      setWishlistCount(wishlistItems.length);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src={logo}
              alt="Baba Mobiles Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-full max-w-md mx-8">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
          <Link to="/shop" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
            Sale
            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              20% OFF
            </span>
          </Link>

          {/* Conditional Sign In / Register Link */}
          {!isLoggedIn && (
            <Link 
              to="/login" 
              className="flex items-center gap-2 whitespace-nowrap hover:text-indigo-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>

        {/* Logged In Actions (Icons) */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <button
                onClick={onWishlistOpen}
                className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={onCartOpen}
                className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
                  <User className="w-5 h-5" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;