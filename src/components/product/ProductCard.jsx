import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Enhanced ProductCard Component with Premium Design
 * Displays product information with glassmorphism and smooth interactions
 */
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    
    // Show feedback animation
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/products/${product._id}`}>
      <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                Sold Out
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-3 bg-white text-primary-500 rounded-full hover:bg-primary-500 hover:text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('addToCart')}
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleLike}
              className={`p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg ${isLiked ? 'text-red-500' : 'text-primary-500'}`}
              title="Add to Wishlist"
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <div className="p-3 bg-white text-primary-500 rounded-full hover:bg-secondary-500 hover:text-white transition-colors shadow-lg">
              <FiEye className="w-5 h-5" />
            </div>
          </div>

          {/* Added Feedback Overlay */}
          {showAddedFeedback && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-fade-in z-20">
              <div className="text-white text-center">
                <div className="text-4xl mb-2 animate-bounce">✓</div>
                <div className="font-bold uppercase tracking-widest text-sm">{t('addedToCart')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 text-center">
          <div className="text-xs text-secondary-500 font-bold uppercase tracking-widest mb-1">
            {product.category}
          </div>
          <h3 className="text-lg font-display font-bold text-primary-500 mb-2 line-clamp-1 group-hover:text-secondary-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary-500 font-medium">
              ৳{product.basePrice?.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 text-sm line-through">
                ৳{product.oldPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    basePrice: PropTypes.number.isRequired,
    oldPrice: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    customizable: PropTypes.bool,
    featured: PropTypes.bool,
  }).isRequired,
};

export default ProductCard;
