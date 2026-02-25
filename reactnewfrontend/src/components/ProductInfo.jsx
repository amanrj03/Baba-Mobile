import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Minus, Plus, Heart, ShieldCheck, Check } from 'lucide-react';
import { cartAPI, productAPI } from '../services/api';

const ProductInfo = ({ product, productId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || product.storage);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      checkWishlistStatus();
    }
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await productAPI.getWishlist();
      const wishlistItems = response.data.results || response.data || [];
      const isInWishlist = wishlistItems.some(item => item.product.id === parseInt(productId));
      setIsWishlisted(isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'increase' && quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setLoading(true);
    try {
      await cartAPI.addToCart({
        product: parseInt(productId),
        quantity: quantity
      });
      window.dispatchEvent(new Event('cartUpdate'));
      // Open cart drawer
      window.dispatchEvent(new Event('openCart'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await productAPI.removeFromWishlist(parseInt(productId));
        setIsWishlisted(false);
      } else {
        await productAPI.addToWishlist(parseInt(productId));
        setIsWishlisted(true);
        // Open wishlist drawer when adding
        window.dispatchEvent(new Event('openWishlist'));
      }
      window.dispatchEvent(new Event('wishlistUpdate'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert(error.response?.data?.error || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-4 font-sans">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
      
      {/* Rating Section */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
          ))}
        </div>
        <span className="text-gray-900 font-medium text-sm">{product.rating}</span>
        <span className="text-gray-500 text-sm">({product.reviewsCount} reviews)</span>
      </div>

      {/* Pricing Section */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
        <span className="text-gray-400 line-through">{product.oldPrice}</span>
        <span className="bg-[#f1ebff] text-[#9b51e0] text-xs font-bold px-2 py-1 rounded">{product.discount}</span>
      </div>

      <p className="text-gray-500 mb-8 leading-relaxed">{product.description}</p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <span className="block text-gray-700 mb-3">Color:</span>
          <div className="flex gap-3">
            {product.colors.map((color, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ring-offset-2 transition-all ${selectedColor?.name === color.name ? 'ring-2 ring-gray-900' : 'hover:ring-2 hover:ring-gray-300'}`}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor?.name === color.name && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-8">
          <span className="block text-gray-700 mb-3">Storage:</span>
          <div className="flex gap-3">
            {product.sizes.map((size, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size ? 'border-[#9b51e0] text-[#9b51e0] bg-[#fdfcff]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-gray-600 mb-4">
        Hurry up! Only <span className="text-red-500 font-medium">({product.stock} items)</span> left in stock
      </p>

      {/* Action Row */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center border border-gray-200 rounded-lg w-32">
          <button onClick={() => handleQuantityChange('decrease')} className="px-3 py-3 text-gray-500 hover:text-gray-900">
            <Minus className="w-4 h-4" />
          </button>
          <input type="text" readOnly value={quantity} className="w-full text-center text-gray-900 font-medium focus:outline-none" />
          <button onClick={() => handleQuantityChange('increase')} className="px-3 py-3 text-gray-500 hover:text-gray-900">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="flex-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button 
          onClick={handleWishlist}
          disabled={loading}
          className={`px-4 border rounded-lg transition-colors disabled:opacity-50 ${
            isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Payment and Security Section */}
      <div className="flex flex-col items-center gap-6 py-8 border-t border-gray-100 mt-4">
        <div className="flex items-center justify-center gap-5">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="American Express" className="h-6 w-auto object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Western_Union_current_logo.svg/500px-Western_Union_current_logo.svg.png" alt="Western Union" className="h-5 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span>Secure checkout with encrypted payment processing</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;