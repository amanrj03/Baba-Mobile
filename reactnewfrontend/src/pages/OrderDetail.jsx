import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderAPI.getOrder(id);
      console.log('Order data:', response.data);
      console.log('Status timeline:', response.data.status_timeline);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await orderAPI.downloadInvoice(id);
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      
      let errorMessage = 'Failed to download invoice. Please try again.';
      
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${error.response?.status}). Please check if the backend server is running.`;
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ordered: 'bg-blue-500',
      shipped: 'bg-purple-500',
      out_for_delivery: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ordered: 'Ordered',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status?.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Order not found</p>
          <Link to="/orders" className="mt-4 inline-block text-[#9b51e0] hover:text-purple-700 font-medium">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-sans text-gray-900">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/orders" className="hover:text-gray-900">Orders</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Order #{order.id}</span>
      </div>

      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order Details</h1>
          <p className="text-sm text-gray-500">Order Number #{order.id}</p>
        </div>
        <span className={`${getStatusColor(order.status)} text-white text-[10px] font-bold px-3 py-1 rounded uppercase`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-1">Order Date</h3>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Email</h3>
            <p className="text-sm text-gray-600">{order.user_email || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Payment Method</h3>
            <p className="text-sm text-gray-600">{order.payment_method || 'Razorpay'}</p>
          </div>
          {order.razorpay_order_id && (
            <div>
              <h3 className="font-bold mb-1">Payment ID</h3>
              <p className="text-sm text-gray-600 font-mono">{order.razorpay_order_id}</p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Shipping Address</h3>
          {order.shipping_address ? (
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
              <p className="mt-2">Phone: {order.shipping_address.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address provided</p>
          )}
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="mb-12">
        <h3 className="font-bold mb-6">Order Status</h3>
        <div className="relative">
          {/* Progress Bar Container */}
          <div className="relative flex items-start justify-between mb-2">
            {/* Background Line - positioned to align with circle centers */}
            <div className="absolute left-0 right-0 h-1 bg-gray-200" style={{ top: '20px', zIndex: 0 }}></div>
            
            {/* Progress Line */}
            <div 
              className="absolute left-0 h-1 bg-blue-500 transition-all duration-500" 
              style={{ 
                top: '20px',
                width: `${(() => {
                  const statusOrder = ['ordered', 'shipped', 'out_for_delivery', 'delivered'];
                  const currentIndex = statusOrder.indexOf(order.status);
                  if (currentIndex === -1 || order.status === 'cancelled') return '0%';
                  return `${(currentIndex / 3) * 100}%`;
                })()}`,
                zIndex: 0
              }}
            ></div>
            
            {/* Status Steps */}
            {['ordered', 'shipped', 'out_for_delivery', 'delivered'].map((status, index) => {
              const statusData = order.status_timeline?.find(item => item.status === status);
              const isCancelled = order.status === 'cancelled';
              
              // Determine if this status should be shown as completed
              const statusOrder = ['ordered', 'shipped', 'out_for_delivery', 'delivered'];
              const currentStatusIndex = statusOrder.indexOf(order.status);
              const thisStatusIndex = statusOrder.indexOf(status);
              const isCompleted = !isCancelled && thisStatusIndex <= currentStatusIndex;
              const isCurrent = order.status === status && !isCancelled && order.status !== 'delivered';
              
              return (
                <div key={status} className="flex-1 flex flex-col items-center" style={{ zIndex: 1 }}>
                  {/* Status Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                    isCancelled ? 'bg-white border-gray-300' :
                    isCompleted ? 'bg-blue-500 border-blue-500' :
                    'bg-white border-gray-300'
                  }`}>
                    {isCompleted && !isCancelled && (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isCurrent && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  
                  {/* Status Label */}
                  <div className="mt-3 text-center">
                    <p className={`text-xs font-semibold whitespace-nowrap ${
                      isCancelled ? 'text-gray-400' :
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {getStatusLabel(status)}
                    </p>
                    {statusData && (
                      <p className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
                        {new Date(statusData.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Cancelled Status */}
          {order.status === 'cancelled' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-semibold">Order Cancelled</p>
              {order.status_timeline?.find(item => item.status === 'cancelled') && (
                <p className="text-sm text-red-600 mt-1">
                  {new Date(order.status_timeline.find(item => item.status === 'cancelled').timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-12">
        <h3 className="font-bold mb-6">Order Items</h3>
        <div className="border-b border-gray-100 pb-2 mb-4 flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
          <span>Product</span>
          <div className="flex gap-20">
            <span>Quantity</span>
            <span>Price</span>
          </div>
        </div>
        {order.items && order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              {item.product.images && item.product.images.length > 0 && (
                <img 
                  src={item.product.images[0].image.startsWith('http') 
                    ? item.product.images[0].image 
                    : `http://localhost:8000${item.product.images[0].image}`}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain bg-gray-50 rounded"
                />
              )}
              <div>
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-[11px] text-gray-400">
                  {item.product.brand_name} • {item.product.ram} • {item.product.storage}
                </p>
              </div>
            </div>
            <div className="flex gap-24 text-sm">
              <span>{item.quantity}</span>
              <span className="font-medium">Rs. {parseFloat(item.price).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="flex flex-col items-end gap-3 mb-12 border-b border-gray-100 pb-8">
        <div className="flex justify-between w-64 text-sm text-gray-600">
          <span>Subtotal</span>
          <span>Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-64 text-sm text-gray-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between w-64 text-lg font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span>Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div>
        <h3 className="font-bold mb-4">Order Actions</h3>
        <button 
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2 border border-blue-500 text-blue-500 font-bold px-4 py-2 rounded uppercase text-xs hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
