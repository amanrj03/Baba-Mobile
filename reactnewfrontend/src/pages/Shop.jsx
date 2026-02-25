import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, Minus, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api";

// New Component for Expandable Filter Sections
const ExpandableFilter = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-2">
      <div
        className="flex items-center justify-between py-3 cursor-pointer group hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`font-medium transition-colors ${isOpen ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}
        >
          {title}
        </span>
        {/* Toggle between Plus and Minus icons */}
        {isOpen ? (
          <Minus className="w-4 h-4 text-gray-900" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        )}
      </div>

      {/* Expanded Content Area */}
      {isOpen && (
        <div className="pt-2 pb-4 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const Shop = () => {
  const [minPrice, setMinPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(150000);
  const minLimit = 10000;
  const maxLimit = 150000;
  
  // State for products and filters
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: [],
    model: [],
    ram: [],
    storage: [],
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, minPrice, maxPrice]);

  const fetchBrands = async () => {
    try {
      const response = await productAPI.getBrands();
      const brandsData = response.data.results || response.data;
      setBrands(Array.isArray(brandsData) ? brandsData : []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]); // Set empty array on error
    }
  };

  const fetchModels = async (brandIds) => {
    try {
      // If brandIds is a single ID, convert to array
      const ids = Array.isArray(brandIds) ? brandIds : [brandIds];
      
      if (ids.length === 0) {
        setModels([]);
        return;
      }
      
      // Fetch models for all selected brands
      const allModels = [];
      for (const brandId of ids) {
        const response = await productAPI.getModels(brandId);
        const modelsData = response.data.results || response.data;
        if (Array.isArray(modelsData)) {
          allModels.push(...modelsData);
        }
      }
      
      // Remove duplicates based on model id
      const uniqueModels = allModels.filter((model, index, self) =>
        index === self.findIndex((m) => m.id === model.id)
      );
      
      setModels(uniqueModels);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Handle sorting
      if (sortBy === 'newest') {
        params.ordering = '-created_at';
      } else if (sortBy === 'price_low') {
        params.ordering = 'price';
      } else if (sortBy === 'price_high') {
        params.ordering = '-price';
      } else if (sortBy === 'sales') {
        params.ordering = '-sales';
      }
      
      // Handle filters
      if (filters.brand.length > 0) {
        params.model__brand = filters.brand.join(',');
      }
      if (filters.model.length > 0) {
        params.model = filters.model.join(',');
      }
      if (filters.ram.length > 0) {
        params.ram = filters.ram.join(',');
      }
      if (filters.storage.length > 0) {
        params.storage = filters.storage.join(',');
      }

      console.log('Fetching products with params:', params);
      const response = await productAPI.getProducts(params);
      const productsData = response.data.results || response.data;
      
      // Filter by price range on frontend
      const filteredProducts = productsData.filter(p => {
        const price = parseFloat(p.final_price || p.price);
        return price >= minPrice && price <= maxPrice;
      });
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleBrandChange = (brandId) => {
    const isCurrentlySelected = filters.brand.includes(brandId);
    
    // Update brand filter
    setFilters(prev => {
      const currentBrands = prev.brand;
      const newBrands = isCurrentlySelected
        ? currentBrands.filter(id => id !== brandId)
        : [...currentBrands, brandId];
      
      // Fetch models for all selected brands
      if (newBrands.length > 0) {
        fetchModels(newBrands);
      } else {
        setModels([]);
      }
      
      // Clear model filter if no brands selected
      return {
        ...prev,
        brand: newBrands,
        model: newBrands.length === 0 ? [] : prev.model
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      brand: [],
      model: [],
      ram: [],
      storage: [],
    });
    setModels([]); // Clear models when resetting
    setMinPrice(minLimit);
    setMaxPrice(maxLimit);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[48px] font-medium text-gray-900 mb-4 text-center">
          Shop all
        </h1>
        <p className="text-[16px] text-gray-500 mb-8 text-center">
          Our most-loved gadgets, trusted by thousands of customers.
        </p>

        <div className="flex items-center justify-start gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Shop</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filter Area */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Filter</h2>
            <button 
              onClick={resetFilters}
              className="text-sm font-medium text-[#9b51e0] hover:text-purple-700"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-1">
            {/* Brand Filter */}
            <ExpandableFilter title="Brand">
              <div className="space-y-3 pt-2">
                {brands && brands.length > 0 ? (
                  brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand.id)}
                        onChange={() => handleBrandChange(brand.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#9b51e0] focus:ring-[#9b51e0]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">
                        {brand.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 pt-2">Loading brands...</div>
                )}
              </div>
            </ExpandableFilter>
            
            {/* Model Filter */}
            <ExpandableFilter title="Model">
              {models.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {models.map((model) => (
                    <label
                      key={model.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.model.includes(model.id)}
                        onChange={() => handleFilterChange('model', model.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#9b51e0] focus:ring-[#9b51e0]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">
                        {model.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 pt-2">Select a brand first</div>
              )}
            </ExpandableFilter>
            {/* Price Range Filter */}
            <ExpandableFilter title="Price Range">
              <div className="pt-4 pb-2 px-1">
                {/* Input Boxes - Read Only */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    <span className="text-gray-400 mr-2">Rs.</span>
                    <input
                      type="text"
                      value={minPrice.toLocaleString()}
                      readOnly
                      className="w-full text-sm outline-none bg-transparent cursor-default"
                    />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">to</span>
                  <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    <span className="text-gray-400 mr-2">Rs.</span>
                    <input
                      type="text"
                      value={maxPrice.toLocaleString()}
                      readOnly
                      className="w-full text-sm outline-none bg-transparent cursor-default"
                    />
                  </div>
                </div>

                {/* Range Slider Container */}
<div className="relative h-6 w-full flex items-center mb-6">
  {/* Track Background */}
  <div className="absolute w-full h-1.5 bg-gray-100 rounded-full z-0" />
  
  {/* Dynamic Purple Progress Bar */}
  <div 
    className="absolute h-1.5 bg-[#6347f9] rounded-full z-10"
    style={{
      left: `${(minPrice / maxLimit) * 100}%`,
      right: `${100 - (maxPrice / maxLimit) * 100}%`
    }}
  />
  
  {/* Left Slider Handle */}
  <input
    type="range"
    min={minLimit}
    max={maxLimit}
    value={minPrice}
    onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 50))}
    className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-30 
      cursor-pointer
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:pointer-events-auto 
      [&::-webkit-slider-thumb]:w-6 
      [&::-webkit-slider-thumb]:h-6 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-white 
      [&::-webkit-slider-thumb]:border-[4px] 
      [&::-webkit-slider-thumb]:border-[#6347f9] 
      [&::-webkit-slider-thumb]:shadow-sm
      [&::-moz-range-thumb]:w-6 
      [&::-moz-range-thumb]:h-6 
      [&::-moz-range-thumb]:rounded-full 
      [&::-moz-range-thumb]:bg-white 
      [&::-moz-range-thumb]:border-[4px] 
      [&::-moz-range-thumb]:border-[#6347f9] 
      [&::-moz-range-thumb]:pointer-events-auto"
  />

  {/* Right Slider Handle */}
  <input
    type="range"
    min={minLimit}
    max={maxLimit}
    value={maxPrice}
    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 50))}
    className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-30 
      cursor-pointer
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:pointer-events-auto 
      [&::-webkit-slider-thumb]:w-6 
      [&::-webkit-slider-thumb]:h-6 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-white 
      [&::-webkit-slider-thumb]:border-[4px] 
      [&::-webkit-slider-thumb]:border-[#6347f9] 
      [&::-webkit-slider-thumb]:shadow-sm
      [&::-moz-range-thumb]:w-6 
      [&::-moz-range-thumb]:h-6 
      [&::-moz-range-thumb]:rounded-full 
      [&::-moz-range-thumb]:bg-white 
      [&::-moz-range-thumb]:border-[4px] 
      [&::-moz-range-thumb]:border-[#6347f9] 
      [&::-moz-range-thumb]:pointer-events-auto"
  />
</div>
              </div>
            </ExpandableFilter>
            <ExpandableFilter title="RAM">
              <div className="space-y-3 pt-2">
                {["4GB", "8GB", "12GB", "16GB"].map((ram) => (
                  <label
                    key={ram}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ram.includes(ram)}
                      onChange={() => handleFilterChange('ram', ram)}
                      className="w-4 h-4 rounded border-gray-300 text-[#9b51e0] focus:ring-[#9b51e0]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {ram}
                    </span>
                  </label>
                ))}
              </div>
            </ExpandableFilter>
            <ExpandableFilter title="Storage">
              <div className="space-y-3 pt-2">
                {["64GB", "128GB", "256GB", "512GB"].map((storage) => (
                  <label
                    key={storage}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.storage.includes(storage)}
                      onChange={() => handleFilterChange('storage', storage)}
                      className="w-4 h-4 rounded border-gray-300 text-[#9b51e0] focus:ring-[#9b51e0]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {storage}
                    </span>
                  </label>
                ))}
              </div>
            </ExpandableFilter>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <span className="text-gray-500 text-sm">
              Showing {products.length} Results
            </span>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-sm">Sort By :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-medium text-sm border-none outline-none cursor-pointer bg-transparent"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="sales">Best Selling</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-[#9b51e0] hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={`Rs. ${product.final_price || product.price}`}
                  oldPrice={product.discount_percent > 0 ? `${product.price}` : null}
                  tag={product.discount_percent > 0 ? `${product.discount_percent}% OFF` : product.stock === 0 ? 'Out of Stock' : null}
                  tagColor={product.discount_percent > 0 ? 'text-[#9b51e0]' : 'text-red-500'}
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
        </div>
      </div>
    </div>
  );
};

export default Shop;
