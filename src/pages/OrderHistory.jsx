import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import Spinner from '../components/common/Spinner';
import { FiPackage, FiClock, FiTruck, FiCheck, FiX } from 'react-icons/fi';

/**
 * OrderHistory Page
 * Display user's past orders
 */
const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <FiX className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500 border border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-500 border border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border border-red-500/30';
      default:
        return 'bg-white/10 text-gray-400 border border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8 text-glow">Order History</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {orders?.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <FiPackage className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue overflow-hidden hover:border-primary-500/30 transition-colors">
                {/* Order Header */}
                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono font-medium text-white">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="font-bold text-primary-500 text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          {item.customDesign?.imageUrl && (
                            <span className="inline-block mt-1 px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded border border-primary-500/30">
                              Custom Design
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-white">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-semibold text-white mb-2">Shipping Address</h3>
                    <p className="text-gray-400">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  {/* Track Order Button */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <a
                      href={`/orders/track/${order._id}`}
                      className="inline-block px-6 py-3 bg-primary-500 text-black rounded-lg hover:bg-white transition font-bold shadow-neon-blue uppercase tracking-wider"
                    >
                      Track Order Status
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
