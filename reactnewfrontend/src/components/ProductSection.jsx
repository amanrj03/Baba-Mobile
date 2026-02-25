import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productAPI } from '../services/api';

const ProductSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts({ ordering: '-created_at' });
      const productsData = response.data.results || response.data;
      // Get first 8 products for home page
      setProducts(productsData.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreAll = () => {
    navigate('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
          <p className="text-gray-500">Our most-loved gadgets, trusted by thousands of customers.</p>
        </div>
        <button 
          onClick={handleExploreAll}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Explore All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.name}
                price={`Rs. ${product.final_price || product.price}`}
                oldPrice={product.discount_percent > 0 ? `${product.price}` : null}
                tag={product.discount_percent > 0 ? `${product.discount_percent}% OFF` : product.stock === 0 ? 'Out of Stock' : 'New'}
                tagColor={product.discount_percent > 0 ? 'text-purple-500' : product.stock === 0 ? 'text-red-500' : 'text-green-500'}
                image={product.images && product.images.length > 0 
                  ? (product.images[0].image.startsWith('http') 
                    ? product.images[0].image 
                    : `http://localhost:8000${product.images[0].image}`)
                  : 'https://via.placeholder.com/400x400?text=No+Image'}
                brand={product.brand_name}
                model={product.model_name}
                ram={product.ram}
                storage={product.storage}
                stock={product.stock}
              />
            ))}
          </div>

          {products.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(4, 8).map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={`$${product.final_price || product.price}`}
                  oldPrice={product.discount_percent > 0 ? `$${product.price}` : null}
                  tag={product.discount_percent > 0 ? `${product.discount_percent}% OFF` : product.stock === 0 ? 'Out of Stock' : 'New'}
                  tagColor={product.discount_percent > 0 ? 'text-purple-500' : product.stock === 0 ? 'text-red-500' : 'text-green-500'}
                  image={product.images && product.images.length > 0 
                    ? (product.images[0].image.startsWith('http') 
                      ? product.images[0].image 
                      : `http://localhost:8000${product.images[0].image}`)
                    : 'https://via.placeholder.com/400x400?text=No+Image'}
                  brand={product.brand_name}
                  model={product.model_name}
                  ram={product.ram}
                  storage={product.storage}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSection;