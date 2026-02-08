import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../redux/api/apiService';
import Spinner from '../../components/common/Spinner';
import { FiMapPin, FiPhone, FiChevronDown, FiChevronUp, FiAlertTriangle, FiActivity } from 'react-icons/fi';

/**
 * Order Management Page (Admin)
 * View and update order statuses with shipping details
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/admin/all');
      setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders(); // Refresh orders
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
      processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
      shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
      delivered: 'bg-green-500/20 text-green-400 border border-green-500/50',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/50',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8 text-glow">Order Management</h1>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Fraud Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.map((order) => (
                  <>
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className="mr-2 text-gray-400 hover:text-white transition-colors"
                          >
                            {expandedOrder === order._id ? (
                              <FiChevronUp className="w-5 h-5" />
                            ) : (
                              <FiChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          <span className="text-sm font-mono text-primary-500">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
                          </div>
                          <div className="text-gray-400">{order.user?.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 flex items-start">
                          <FiMapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-primary-500" />
                          <div>
                            <div>{order.shippingAddress?.city || 'N/A'}</div>
                            <div className="text-gray-500 text-xs">
                              {order.shippingAddress?.country || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm font-medium ${
                          (order.fraudScore || 0) > 0.8 ? 'text-red-500' : 
                          (order.fraudScore || 0) > 0.5 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {(order.fraudScore || 0) > 0.5 && <FiAlertTriangle className="mr-1" />}
                          {((order.fraudScore || 0) * 100).toFixed(0)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="px-2 py-1 bg-black/50 border border-white/20 rounded-sm text-sm text-white focus:outline-none focus:border-primary-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-white/5 border-t border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                              <h4 className="font-display font-bold text-white mb-3 flex items-center">
                                <FiMapPin className="mr-2 text-primary-500" />
                                Shipping Address
                              </h4>
                              <div className="space-y-1 text-sm text-gray-300">
                                <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="flex items-center mt-2 text-primary-400">
                                  <FiPhone className="mr-2" />
                                  {order.shippingAddress.phone}
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                              <h4 className="font-display font-bold text-white mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                                    <div>
                                      <p className="font-medium text-white">{item.name}</p>
                                      <div className="text-gray-400 text-xs mt-1 space-y-0.5">
                                        <p>Qty: {item.quantity}</p>
                                        {item.size && (
                                          <p className="flex items-center">
                                            <span className="font-medium mr-1">Size:</span> {item.size}
                                          </p>
                                        )}
                                        {item.color && (
                                          <p className="flex items-center">
                                            <span className="font-medium mr-1">Color:</span> {item.color}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="font-medium text-primary-400">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white">
                                  <span>Total:</span>
                                  <span className="text-primary-500">${order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            
                            {/* Device Info */}
                            <div className="bg-black/40 p-4 rounded-lg border border-white/10 col-span-1 md:col-span-2">
                              <h4 className="font-display font-bold text-white mb-3 flex items-center">
                                <FiActivity className="mr-2 text-blue-500" />
                                Device & Network
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">IP Address:</span>
                                  <span className="ml-2 font-mono text-primary-400">{order.ipAddress || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">User Agent:</span>
                                  <span className="ml-2 text-gray-300 truncate block" title={order.userAgent}>
                                    {order.userAgent || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Fraud Analysis */}
                            {(order.fraudScore > 0 || order.fraudReason) && (
                              <div className="bg-black/40 p-4 rounded-lg border border-white/10 col-span-1 md:col-span-2">
                                <h4 className="font-display font-bold text-white mb-3 flex items-center">
                                  <FiAlertTriangle className={`mr-2 ${
                                    order.fraudScore > 0.8 ? 'text-red-500' : 'text-yellow-500'
                                  }`} />
                                  Fraud Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-400">Risk Score:</span>
                                    <span className={`ml-2 font-bold ${
                                      order.fraudScore > 0.8 ? 'text-red-500' : 
                                      order.fraudScore > 0.5 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                      {(order.fraudScore * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="md:col-span-2">
                                    <span className="text-gray-400">Analysis:</span>
                                    <span className="ml-2 text-white">{order.fraudReason || 'No specific risk detected'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
