import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../redux/api/apiService';
import { clearCart } from '../redux/slices/cartSlice';
import { useLanguage } from '../i18n/LanguageContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import useAnalytics from '../hooks/useAnalytics';

/**
 * Checkout Page
 * Order placement with Cash on Delivery and Dhaka delivery charges
 */
const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { trackEvent } = useAnalytics('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });

  const [deliveryArea, setDeliveryArea] = useState('inside'); // 'inside' or 'outside' Dhaka
  const [deliveryCharge, setDeliveryCharge] = useState(60);

  // Delivery charges
  const DELIVERY_CHARGES = {
    inside: 60,  // Inside Dhaka
    outside: 120, // Outside Dhaka
  };

  useEffect(() => {
    // Auto-detect delivery area based on city
    const city = shippingAddress.city.toLowerCase();
    if (city.includes('dhaka') || city.includes('ঢাকা')) {
      setDeliveryArea('inside');
      setDeliveryCharge(DELIVERY_CHARGES.inside);
    } else if (city && city !== '') {
      setDeliveryArea('outside');
      setDeliveryCharge(DELIVERY_CHARGES.outside);
    }
  }, [shippingAddress.city]);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeliveryAreaChange = (area) => {
    setDeliveryArea(area);
    setDeliveryCharge(DELIVERY_CHARGES[area]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          material: item.material,
          customDesign: item.customDesign,
        })),
        shippingAddress,
        deliveryCharge,
        paymentMethod: 'Cash on Delivery',
      };

      const { data } = await api.post('/api/orders', orderData);
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      trackEvent('PURCHASE', { 
        orderId: data.data._id, 
        total: grandTotal, 
        itemCount: items.length 
      });

      toast.success('Order placed successfully!');
      // Navigate to order tracking
      navigate(`/orders/track/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const grandTotal = total + deliveryCharge;

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8 text-glow">{t('checkout')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 shadow-neon-blue">
              <h2 className="text-2xl font-display font-bold text-white mb-6">{t('shippingInformation')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('fullName')}
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  required
                />

                <Input
                  label={t('phoneNumber')}
                  name="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  required
                />

                <Input
                  label={t('address')}
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  placeholder="House/Flat, Road, Area"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('city')}
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="e.g., Dhaka, Chittagong"
                    required
                  />

                  <Input
                    label={t('postalCode')}
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    required
                  />
                </div>

                <Input
                  label="Country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  disabled
                />

                {/* Delivery Area Selection */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t('deliveryArea')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleDeliveryAreaChange('inside')}
                      className={`p-4 border rounded-lg transition ${
                        deliveryArea === 'inside'
                          ? 'border-primary-500 bg-primary-500/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <p className="font-semibold">{t('insideDhaka')}</p>
                      <p className="text-sm opacity-80">৳{DELIVERY_CHARGES.inside} {t('deliveryCharge')}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeliveryAreaChange('outside')}
                      className={`p-4 border rounded-lg transition ${
                        deliveryArea === 'outside'
                          ? 'border-primary-500 bg-primary-500/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <p className="font-semibold">{t('outsideDhaka')}</p>
                      <p className="text-sm opacity-80">৳{DELIVERY_CHARGES.outside} {t('deliveryCharge')}</p>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  className="mt-6"
                >
                  {t('placeOrder')} ({t('cashOnDelivery')})
                </Button>
              </form>
            </div>

            {/* Payment Method Info */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-semibold text-blue-400 mb-2">💵 {t('cashOnDelivery')}</h3>
              <p className="text-blue-300 text-sm">
                {t('cashOnDeliveryDesc') || 'Pay with cash when your order is delivered to your doorstep. No advance payment required!'}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24 shadow-neon-blue">
              <h2 className="text-2xl font-display font-bold text-white mb-6">{t('orderSummary')}</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.product.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-white">
                      ৳{(item.product.basePrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-white">৳{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('deliveryCharge')}</span>
                  <span className="font-medium text-white">
                    ৳{deliveryCharge.toFixed(2)}
                    <span className="text-xs ml-1 text-gray-500">
                      ({deliveryArea === 'inside' ? t('insideDhaka') : t('outsideDhaka')})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary-500 pt-2 border-t border-white/10">
                  <span>{t('total')}</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{t('paymentMethod') || 'Payment Method'}:</span>
                  <span className="font-semibold text-green-400">{t('cashOnDelivery')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
