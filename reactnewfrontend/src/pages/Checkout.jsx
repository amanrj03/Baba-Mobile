import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import { Country, State, City } from 'country-state-city';
import fedex from '../assets/fedex.png';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('fedex');
  
  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    country_code: '+1',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    additional_info: ''
  });

  useEffect(() => {
    fetchCart();
    loadCountries();
  }, []);

  const loadCountries = () => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    
    // Set default to United States
    const us = allCountries.find(c => c.isoCode === 'US');
    if (us) {
      setSelectedCountry(us);
      setFormData(prev => ({ ...prev, country: us.name, country_code: us.phonecode }));
      loadStates(us.isoCode);
    }
  };

  const loadStates = (countryCode) => {
    const allStates = State.getStatesOfCountry(countryCode);
    setStates(allStates);
    setCities([]);
    setSelectedState(null);
  };

  const loadCities = (countryCode, stateCode) => {
    const allCities = City.getCitiesOfState(countryCode, stateCode);
    setCities(allCities);
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.isoCode === countryCode);
    
    if (country) {
      setSelectedCountry(country);
      setFormData(prev => ({ 
        ...prev, 
        country: country.name,
        country_code: country.phonecode,
        state: '',
        city: ''
      }));
      loadStates(countryCode);
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const state = states.find(s => s.isoCode === stateCode);
    
    if (state) {
      setSelectedState(state);
      setFormData(prev => ({ ...prev, state: state.name, city: '' }));
      loadCities(selectedCountry.isoCode, stateCode);
    }
  };

  const handleCityChange = (e) => {
    setFormData(prev => ({ ...prev, city: e.target.value }));
  };

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      const items = response.data.items || [];
      setCartItems(items);
      calculateSubtotal(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      // Create order
      const orderData = {
        shipping_address: {
          full_name: formData.full_name,
          phone: formData.country_code + formData.phone,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip_code,
          country: formData.country
        },
        additional_info: formData.additional_info,
        delivery_method: deliveryMethod
      };

      const response = await orderAPI.createOrder(orderData);
      
      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: 'INR',
        name: 'Baba Mobiles',
        description: 'Order Payment',
        order_id: response.data.razorpay_order_id,
        handler: async function (razorpayResponse) {
          // Payment successful - verify on backend
          try {
            const verifyResponse = await orderAPI.verifyPayment({
              order_id: razorpayResponse.razorpay_order_id,
              payment_id: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature
            });
            
            // Navigate to success page
            navigate('/order-success', { 
              state: { 
                orderId: verifyResponse.data.order_id,
                paymentId: razorpayResponse.razorpay_payment_id 
              } 
            });
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            alert('Payment verification failed. Please contact support with Order ID: ' + response.data.id);
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.full_name,
          contact: formData.country_code + formData.phone
        },
        theme: {
          color: '#9b51e0'
        },
        modal: {
          ondismiss: function() {
            // Payment modal closed without completion
            setSubmitting(false);
            alert('Payment cancelled. Your cart items are still saved. You can try again.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.error || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const shippingCost = 5.99;
  const discount = 0;
  const total = subtotal + shippingCost - discount;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <Link to="/shop" className="mt-4 inline-block text-[#9b51e0] hover:text-purple-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-gray-900">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Checkout</span>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-12">
        
        {/* Left Column: Form Information (Scrolls naturally) */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Fill up this information</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div>
              <label className="block text-gray-600 mb-2">Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative w-40">
                  <select 
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-purple-500 text-sm appearance-none pr-8"
                  >
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.phonecode}>
                        {country.flag} {country.phonecode} {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="555-000-0000"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Country</label>
              <select 
                value={selectedCountry?.isoCode || ''}
                onChange={handleCountryChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-2">State</label>
                {states.length > 0 ? (
                  <select 
                    value={selectedState?.isoCode || ''}
                    onChange={handleStateChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter state name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-600 mb-2">City</label>
                {cities.length > 0 ? (
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Zip Code</label>
              <input 
                type="text" 
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500" 
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Additional Information</label>
              <textarea 
                rows="5" 
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
                placeholder="Enter your message here..." 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 resize-none"
              ></textarea>
            </div>

            {/* Delivery Methods */}
            <div className="pt-6">
              <h3 className="text-xl font-bold mb-4">Delivery With</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setDeliveryMethod('fedex')}
                  className={`${deliveryMethod === 'fedex' ? 'border-2 border-purple-500' : 'border border-gray-100'} rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-colors`}
                >
                  <img src={fedex} alt="FedEx" className="h-4" />
                  <div>
                    <p className="font-bold text-gray-900">Rs. 5.99</p>
                    <p className="text-xs text-gray-400">3-5 days</p>
                  </div>
                </div>
                <div 
                  onClick={() => setDeliveryMethod('dhl')}
                  className={`${deliveryMethod === 'dhl' ? 'border-2 border-purple-500' : 'border border-gray-100'} rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-colors`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg" alt="DHL" className="h-4" />
                  <div>
                    <p className="font-bold text-gray-900">Rs. 5.99</p>
                    <p className="text-xs text-gray-400">3-5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: STICKY Price Summary */}
        <aside className="w-full lg:w-[420px]">
          <div className="sticky top-8 border border-gray-100 rounded-3xl p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-1">Price Summary</h2>
            <p className="text-gray-400 text-sm mb-8">You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>

            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                    <img 
                      src={item.product.images && item.product.images.length > 0 
                        ? (item.product.images[0].image.startsWith('http') 
                          ? item.product.images[0].image 
                          : `http://localhost:8000${item.product.images[0].image}`)
                        : 'https://via.placeholder.com/64x64?text=No+Image'} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{item.product.name}</h4>
                    <p className="text-xs text-gray-400">
                      {item.product.brand_name} - {item.quantity}x - {item.product.storage}
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      Rs. {(parseFloat(item.product.final_price || item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-8 border-t border-gray-100 pt-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-gray-900 font-bold">Rs. {shippingCost.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gray-500 border-b border-gray-100 pb-4">
                  <span>Discount</span>
                  <span className="text-green-500 font-bold">-Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total Amount</span>
                <span className="text-[#9b51e0]">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#9b51e0] hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Proceed to checkout'}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;
