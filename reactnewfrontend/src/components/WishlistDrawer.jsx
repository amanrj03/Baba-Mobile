import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { productAPI, cartAPI } from '../services/api';

const WishlistDrawer = ({ isOpen, onClose, onWishlistUpdate }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWishlist();
    }
  }, [isOpen]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getWishlist();
      const items = response.data.results || response.data || [];
      setWishlistItems(items);
      if (onWishlistUpdate) {
        onWishlistUpdate(items.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await productAPI.removeFromWishlist(productId);
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartAPI.addToCart({
        product: product.id,
        quantity: 1
      });
      window.dispatchEvent(new Event('cartUpdate'));
      // Open cart drawer
      window.dispatchEvent(new Event('openCart'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Wishlist Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Wishlist ({wishlistItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b51e0]"></div>
              <p className="mt-2 text-gray-500">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={item.product.images && item.product.images.length > 0 
                      ? (item.product.images[0].image.startsWith('http') 
                        ? item.product.images[0].image 
                        : `http://localhost:8000${item.product.images[0].image}`)
                      : 'https://via.placeholder.com/96x96?text=No+Image'} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain mix-blend-multiply" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.product.name}</h3>
                    <button 
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {item.product.brand_name} • {item.product.ram} • {item.product.storage}
                  </p>
                  <p className="font-bold text-gray-900 mb-3">
                    Rs. {parseFloat(item.product.final_price || item.product.price).toFixed(2)}
                  </p>
                  
                  <button 
                    onClick={() => handleAddToCart(item.product)}
                    className="px-4 py-2 bg-[#9b51e0] hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-[#9b51e0] hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;