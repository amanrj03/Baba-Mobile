import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session-based OTP
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle blob error responses
    if (error.response?.data instanceof Blob && error.response?.data.type === 'application/json') {
      try {
        const text = await error.response.data.text();
        error.response.data = JSON.parse(text);
      } catch (e) {
        // If parsing fails, keep the blob
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  sendOTP: (email) => api.post('/accounts/send-otp/', { email }),
  verifyOTP: (otp) => api.post('/accounts/verify-otp/', { otp }),
  resendOTP: () => api.post('/accounts/resend-otp/'),
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/', data),
  changePassword: (data) => api.post('/accounts/change-password/', data),
  deleteAccount: () => api.delete('/accounts/delete-account/'),
  getAddresses: () => api.get('/accounts/addresses/'),
  createAddress: (data) => api.post('/accounts/addresses/', data),
  updateAddress: (id, data) => api.patch(`/accounts/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/accounts/addresses/${id}/`),
};

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  getBrands: () => api.get('/products/brands/'),
  getModels: (brandId) => api.get('/products/models/', { params: { brand: brandId } }),
  getReviews: (productId) => api.get(`/products/${productId}/reviews/`),
  submitReview: (productId, data) => api.post(`/products/${productId}/reviews/`, data),
  canReview: (productId) => api.get(`/products/${productId}/can-review/`),
  getWishlist: () => api.get('/products/wishlist/'),
  addToWishlist: (productId) => api.post('/products/wishlist/', { product: productId }),
  removeFromWishlist: (productId) => api.delete(`/products/wishlist/${productId}/delete/`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data) => api.post('/cart/add/', data),
  updateItem: (id, data) => api.patch(`/cart/items/${id}/`, data),
  removeItem: (id) => api.delete(`/cart/items/${id}/remove/`),
};

// Order APIs
export const orderAPI = {
  getOrders: () => api.get('/orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/create/', data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  verifyPayment: (data) => api.post('/orders/verify-payment/', data),
  downloadInvoice: (id) => api.get(`/orders/${id}/download-invoice/`, { responseType: 'blob' }),
};

export default api;
