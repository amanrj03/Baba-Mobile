import React from 'react';
import { Crown, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

const Features = () => (
  <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center border-t border-gray-100">
    <div className="flex flex-col items-center">
      <Crown className="w-8 h-8 text-gray-700 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
      <p className="text-gray-500 text-sm">Built to deliver reliable and long-lasting durability.</p>
    </div>
    <div className="flex flex-col items-center">
      <Truck className="w-8 h-8 text-gray-700 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
      <p className="text-gray-500 text-sm">Quick and secure delivery, wherever you are.</p>
    </div>
    <div className="flex flex-col items-center">
      <RefreshCw className="w-8 h-8 text-gray-700 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
      <p className="text-gray-500 text-sm">30-day hassle-free exchange and refund.</p>
    </div>
    <div className="flex flex-col items-center">
      <ShieldCheck className="w-8 h-8 text-gray-700 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Secure Checkout</h3>
      <p className="text-gray-500 text-sm">Protected payments with warranty-backed purchases.</p>
    </div>
  </div>
);

export default Features;