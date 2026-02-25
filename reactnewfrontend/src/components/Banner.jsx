import React from 'react';

const Banner = () => (
  <div className="max-w-7xl mx-auto px-8 py-12">
    <div className="bg-gradient-to-r from-[#a88bff] to-[#8d6aee] rounded-3xl p-16 text-center text-white">
      <p className="text-sm font-medium mb-4 tracking-wide">Upgrade Your Tech Game</p>
      <h2 className="text-5xl font-bold mb-6">Get upto 30% OFF<br/>all Products</h2>
      <p className="mb-8 text-white/80 max-w-md mx-auto">Save up to 30% on selected smart gadgets this week. Visit our sale page and buy now.</p>
      <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">Shop The Sale</button>
    </div>
  </div>
);

export default Banner;