import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart } from '../redux/slices/cartSlice';
import { useLanguage } from '../i18n/LanguageContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import useAnalytics from '../hooks/useAnalytics';

/**
 * Cart Page
 * Shopping cart with items list and checkout
 */
const Cart = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { trackEvent } = useAnalytics('public');

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleCheckout = () => {
    trackEvent('CHECKOUT_INIT', { 
      total, 
      itemCount: items?.length 
    });
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-24 px-4">
        <div className="text-center">
          <FiShoppingCart className="w-20 h-20 mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('pleaseSignIn')}</h2>
          <p className="text-gray-400 mb-6">{t('needToBeLoggedIn')}</p>
          <Link to="/login">
            <Button variant="primary" size="lg">
              {t('signIn')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-24 px-4">
        <div className="text-center">
          <FiShoppingCart className="w-20 h-20 mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('yourCartIsEmpty')}</h2>
          <p className="text-gray-400 mb-6">{t('addSomeProducts')}</p>
          <Link to="/products">
            <Button variant="primary" size="lg">
              {t('browseProducts')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">{t('shoppingCart')}</h1>
          <p className="text-gray-400">
            {items?.length} {items?.length !== 1 ? t('items') : t('item')} {t('itemsInCart')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24 shadow-neon-blue">
              <h2 className="text-2xl font-display font-bold text-white mb-6">{t('orderSummary')}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('shipping')}</span>
                  <span className="font-medium text-white">{t('calculatedAtCheckout')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('tax')}</span>
                  <span className="font-medium text-white">{t('calculatedAtCheckout')}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xl font-bold text-primary-500">
                    <span>{t('total')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className="mb-4"
              >
                {t('proceedToCheckout')}
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Link to="/products">
                <Button variant="outline" size="md" fullWidth>
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
