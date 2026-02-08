import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../redux/api/apiService';
import Spinner from '../components/common/Spinner';
import { FiPackage, FiClock, FiTruck, FiCheck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

/**
 * OrderTracking Page
 * Detailed order status tracking for users
 */
const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/api/orders/${orderId}`);
      setOrder(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: <FiClock /> },
      { key: 'processing', label: 'Processing', icon: <FiPackage /> },
      { key: 'shipped', label: 'Shipped', icon: <FiTruck /> },
      { key: 'delivered', label: 'Delivered', icon: <FiCheck /> },
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const getStatusMessage = (status) => {
    const messages = {
      pending: 'Your order has been received and is awaiting processing.',
      processing: 'We are preparing your order for shipment.',
      shipped: 'Your order is on its way! Check tracking details below.',
      delivered: 'Your order has been delivered. Enjoy your purchase!',
      cancelled: 'This order has been cancelled.',
    };
    return messages[status] || 'Order status unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-24 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'Unable to find this order'}</p>
          <Link to="/orders">
            <button className="px-6 py-3 bg-primary-500 text-black rounded-lg hover:bg-white transition font-bold shadow-neon-blue">
              View All Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/orders" className="text-primary-500 hover:text-primary-400 mb-4 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">Track Your Order</h1>
          <p className="text-gray-400">
            Order ID: <span className="font-mono font-semibold text-white">{order._id.slice(-8).toUpperCase()}</span>
          </p>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {order.status === 'delivered' ? (
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <FiCheck className="w-6 h-6 text-green-500" />
                </div>
              ) : order.status === 'cancelled' ? (
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                  <FiPackage className="w-6 h-6 text-red-500" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                  <FiTruck className="w-6 h-6 text-primary-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 capitalize">
                {order.status === 'delivered' ? 'Delivered!' : order.status}
              </h3>
              <p className="text-gray-400">{getStatusMessage(order.status)}</p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        {order.status !== 'cancelled' && (
          <div className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue p-8 mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Order Progress</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-white/10">
                <div
                  className="h-full bg-primary-500 transition-all duration-500 shadow-neon-blue"
                  style={{
                    width: `${(statusSteps.filter(s => s.completed).length - 1) * 33.33}%`,
                  }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all border ${
                        step.completed
                          ? 'bg-primary-500 text-black border-primary-500 shadow-neon-blue'
                          : 'bg-black text-gray-600 border-white/10'
                      } ${step.active ? 'ring-4 ring-primary-500/20' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm font-medium text-center ${
                        step.completed ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue p-6 mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center">
            <FiMapPin className="mr-2 text-primary-500" />
            Shipping Address
          </h2>
          <div className="space-y-2 text-gray-300">
            <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="flex items-center mt-3 text-gray-400">
              <FiPhone className="mr-2" />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue p-6 mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 pb-4 border-b border-white/10 last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                    {item.size && (
                      <span className="text-sm px-2 py-0.5 bg-white/10 rounded text-gray-300">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-sm px-2 py-0.5 bg-white/10 rounded text-gray-300">
                        Color: {item.color}
                      </span>
                    )}
                    {item.customDesign?.imageUrl && (
                      <span className="text-sm px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded border border-primary-500/30">
                        Custom Design
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-primary-500">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span className="text-primary-500">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            If you have any questions about your order, please contact us.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@mmgazette.com"
              className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-white"
            >
              <FiMail className="mr-2" />
              Email Support
            </a>
            <a
              href="tel:+880123456789"
              className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-white"
            >
              <FiPhone className="mr-2" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
