import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';

const CartDrawer = ({ isOpen, onClose, onCartUpdate }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      const items = response.data.items || [];
      setCartItems(items);
      calculateSubtotal(items);
      if (onCartUpdate) {
        onCartUpdate(items.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.product.final_price || item.product.price);
      return sum + (price * item.quantity);
    }, 0);
    setSubtotal(total);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateItem(itemId, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
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

      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b51e0]"></div>
              <p className="mt-2 text-gray-500">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                    <img 
                      src={item.product.images && item.product.images.length > 0 
                        ? (item.product.images[0].image.startsWith('http') 
                          ? item.product.images[0].image 
                          : `http://localhost:8000${item.product.images[0].image}`)
                        : 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                      <span className="font-bold text-gray-900">
                        Rs. {(parseFloat(item.product.final_price || item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      {item.product.brand_name} • {item.product.ram} • {item.product.storage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1.5 text-gray-400 hover:text-gray-900"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1.5 text-gray-400 hover:text-gray-900"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900 font-bold">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gray-900">Rs. {subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onClose}
              className="w-full py-3.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
            <button 
              onClick={handleCheckout} 
              disabled={cartItems.length === 0}
              className="w-full py-3.5 bg-[#9b51e0] hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Process to checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;