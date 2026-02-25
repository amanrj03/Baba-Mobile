import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSpecifications from '../components/ProductSpecifications';
import ProductReviews from '../components/ProductReviews';
import { productAPI } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkCanReview();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await productAPI.canReview(id);
        setCanReview(response.data.can_review);
      }
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link to="/shop" className="mt-4 inline-block text-[#9b51e0] hover:text-purple-700 font-medium">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Transform product data to match component expectations
  const productData = {
    name: product.name,
    price: `Rs. ${product.final_price || product.price}`,
    oldPrice: product.discount_percent > 0 ? `${product.price}` : null,
    discount: product.discount_percent > 0 ? `${product.discount_percent}% OFF` : null,
    rating: product.average_rating || 0,
    reviewsCount: product.review_count || 0,
    description: product.description,
    colors: [], // Not implemented in backend yet
    sizes: [product.storage], // Using storage as size
    stock: product.stock,
    images: product.images?.map(img => 
      img.image.startsWith('http') ? img.image : `http://localhost:8000${img.image}`
    ) || [],
    specifications: product.specifications ? 
      (typeof product.specifications === 'string' ? 
        product.specifications.split('\n').filter(s => s.trim()) : 
        product.specifications) : 
      [],
    reviews: product.reviews || [],
    brand: product.brand_name,
    model: product.model_name,
    ram: product.ram,
    storage: product.storage,
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center justify-start gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-gray-900">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{productData.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductGallery images={productData.images} productName={productData.name} />
        <ProductInfo product={productData} productId={id} />
      </div>

      <ProductSpecifications specifications={productData.specifications} />
      <ProductReviews 
        reviews={productData.reviews} 
        hasPurchased={canReview} 
        productId={id}
      />

    </div>
  );
};

export default ProductDetails;