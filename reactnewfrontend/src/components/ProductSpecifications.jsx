import React from 'react';

const ProductSpecifications = ({ specifications }) => (
  <div className="mb-20">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
    <div className="max-w-4xl">
      <ul className="space-y-5">
        {specifications.map((spec, idx) => (
          <li key={idx} className="flex gap-4 items-start group">
            {/* Clean Bullet Point */}
            <span className="text-[#9b51e0] text-2xl leading-none select-none mt-[-2px]">•</span>
            
            {/* Specification Text */}
            <p className="text-gray-600 text-base md:text-[17px] leading-relaxed group-hover:text-gray-900 transition-colors">
              {spec}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProductSpecifications;