import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ 
  id,
  title, 
  price, 
  oldPrice, 
  tag, 
  tagColor = 'text-green-500',
  image,
  brand,
  model,
  ram,
  storage,
  stock
}) => {
  const navigate = useNavigate();
  
  const handleBuyClick = () => {
    navigate(`/product/${id}`);
  };

  const handleLearnMore = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="w-full max-w-[380px] bg-[#f7f7f7] border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 font-sans cursor-pointer">
      {/* Tag Badge */}
      <div className="h-6 mb-2">
        {tag && (
          <span className={`${tagColor} font-bold text-sm`}>{tag}</span>
        )}
      </div>

      {/* Product Image Container */}
      <div 
        className="flex justify-center items-center mb-8 h-[320px] w-full"
        onClick={handleLearnMore}
      >
        <img 
          src={image} 
          alt={title} 
          className="max-h-full max-w-full object-contain mix-blend-multiply" 
          style={{ height: '320px', width: 'auto', maxWidth: '100%' }}
          onError={(e) => {
            console.error('Image failed to load:', image);
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
      </div>

      {/* Product Information */}
      <div className="space-y-4">
        <h3 
          className="text-[24px] leading-tight font-bold text-gray-900 tracking-tight hover:text-[#9b51e0] transition-colors"
          onClick={handleLearnMore}
        >
          {title}
        </h3>

        {brand && model && (
          <p className="text-sm text-gray-600">
            {brand} {model} • {ram} • {storage}
          </p>
        )}

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-gray-900">{price}</span>
            {oldPrice && (
              <span className="text-gray-400 line-through text-sm">{oldPrice}</span>
            )}
          </div>
          {stock !== undefined && (
            <p className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button 
            onClick={handleBuyClick}
            disabled={stock === 0}
            className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-full transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {stock === 0 ? 'Out of Stock' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;