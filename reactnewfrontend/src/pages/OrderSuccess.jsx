    import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-8 py-20 bg-white">
      <div className="max-w-2xl w-full text-center">
        
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
            <Check className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Heading Section */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-500 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Your order has been successfully placed. We've sent a confirmation email with your order details.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 mb-12 text-left">
          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Order Number:</span>
            <span className="text-gray-900 font-bold">#TGS-93632</span>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-gray-500 font-medium">Estimated Delivery:</span>
            <span className="text-gray-900 font-bold">3–5 business days</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-10 py-4 bg-[#9b51e0] hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-100"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-10 py-4 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;