import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      ordered: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ordered: 'Ordered',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status.toLowerCase()] || status;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">My Orders</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="Search orders..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No orders found matching your search' : 'No orders yet'}
          </p>
          <Link to="/shop" className="mt-4 inline-block text-[#9b51e0] hover:text-purple-700 font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-bold text-gray-900 border-b border-gray-100">
                <th className="pb-4">Order #</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Order Date</th>
                <th className="pb-4">Delivery Address</th>
                <th className="pb-4">Payment</th>
                <th className="pb-4 text-right">Order Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => window.location.href = `/orders/${order.id}`}
                  className="text-sm text-gray-600 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-5">
                    <span className="text-[#006ceb] font-bold">
                      #{order.id}
                    </span>
                  </td>
                  <td className="py-5">
                    <span className={`${getStatusColor(order.status)} text-[10px] font-bold px-2 py-1 rounded border uppercase`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-5">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-5">
                    {order.shipping_address ? 
                      `${order.shipping_address.city}, ${order.shipping_address.state}` : 
                      'N/A'}
                  </td>
                  <td className="py-5">{order.payment_method || 'Razorpay'}</td>
                  <td className="py-5 text-right font-medium text-gray-900">
                    Rs. {parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
