import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../redux/api/apiService';
import Spinner from '../components/common/Spinner';
import { FiPackage, FiClock, FiTruck, FiCheck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

/**
 * GuestOrderTracking Page
 * Public tracking page for ad users (no login required)
 */
const GuestOrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Use the public tracking endpoint
      const { data } = await api.get(`/api/orders/track/${orderId}`);
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
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center py-24 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'Unable to find this order'}</p>
          <Link to="/">
            <button className="px-6 py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition font-bold shadow-lg">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-[#1a0b2e] py-12 text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="text-yellow-400">MM</span> Gazette Tracking
          </h1>
          <p className="text-gray-400">
            Order ID: <span className="font-mono font-semibold text-white">{order._id.slice(-8).toUpperCase()}</span>
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-[#2d1b4e] border border-purple-500/30 rounded-xl shadow-lg p-6 mb-8">
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
                <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-full flex items-center justify-center border border-[#7c3aed]/30">
                  <FiTruck className="w-6 h-6 text-[#7c3aed]" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 capitalize">
                {order.status === 'delivered' ? 'Delivered!' : order.status}
              </h3>
              <p className="text-gray-300">{getStatusMessage(order.status)}</p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        {order.status !== 'cancelled' && (
          <div className="bg-[#2d1b4e] border border-purple-500/30 rounded-xl shadow-lg p-8 mb-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-6">Order Progress</h2>
            <div className="relative min-w-[300px]">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-white/10">
                <div
                  className="h-full bg-[#7c3aed] transition-all duration-500"
                  style={{
                    width: `${(statusSteps.filter(s => s.completed)?.length - 1) * 33.33}%`,
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
                          ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-lg'
                          : 'bg-[#1a0b2e] text-gray-500 border-white/10'
                      } ${step.active ? 'ring-4 ring-[#7c3aed]/20' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm font-medium text-center ${
                        step.completed ? 'text-white' : 'text-gray-500'
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
        <div className="bg-[#2d1b4e] border border-purple-500/30 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <FiMapPin className="mr-2 text-[#7c3aed]" />
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
        <div className="bg-[#2d1b4e] border border-purple-500/30 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
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
                  </div>
                </div>
                <p className="font-semibold text-[#7c3aed]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span className="text-[#7c3aed]">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            If you have any questions about your order, please contact us.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:+880123456789"
              className="inline-flex items-center px-4 py-2 bg-[#2d1b4e] border border-purple-500/30 rounded-lg hover:bg-[#3e256b] transition text-white"
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

export default GuestOrderTracking;
