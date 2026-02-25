import React, { useState } from 'react';

const ProductGallery = ({ images, productName }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image - Large and centered */}
      <div className="flex items-center justify-center h-[500px] w-full">
        <img 
          src={mainImage} 
          alt={productName} 
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-opacity duration-300" 
          style={{ height: '500px', width: 'auto', maxWidth: '100%' }}
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setMainImage(img)}
            className={`bg-[#f8f9fb] rounded-xl flex items-center justify-center h-24 cursor-pointer transition-all overflow-hidden ${
              mainImage === img 
                ? 'ring-2 ring-[#9b51e0] border-transparent' 
                : 'border border-gray-100 hover:border-gray-300'
            }`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              style={{ height: '96px', width: 'auto', maxWidth: '100%' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;