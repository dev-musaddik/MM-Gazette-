import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct, createProductReview } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import useAnalytics from '../hooks/useAnalytics';

/**
 * ProductDetails Page
 * Detailed product view with options and add to cart
 */
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { trackEvent } = useAnalytics('public');
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
      })
    );
    trackEvent('ADD_TO_CART', { 
      productId: product._id, 
      name: product.name, 
      price: product.basePrice, 
      quantity 
    });
    toast.success('Added to cart');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    setReviewSubmitting(true);
    try {
      await dispatch(createProductReview({
        productId: id,
        reviewData: { rating: Number(rating), comment }
      })).unwrap();
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      dispatch(fetchProductById(id)); // Refetch to show new review
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <Link to="/products">
            <Button variant="outline">Back to Gadgets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-4 shadow-neon-blue">
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-contain p-8"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-24 object-contain p-2 cursor-pointer hover:opacity-75 transition"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-500 text-xs font-bold uppercase tracking-wider rounded-sm border border-primary-500/50">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-sm border border-white/10">
                    {product.brand}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-4 text-glow">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500 text-sm mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < (product.rating || 0) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-primary-500 mb-4">
                ${product.basePrice?.toFixed(2)}
              </p>
              {product.stock > 0 ? (
                <p className="text-green-400 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-500 font-medium">Out of Stock</p>
              )}
            </div>

            <div className="border-t border-b border-white/10 py-6 mb-6">
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Tech Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-display font-bold text-white mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-white/5 rounded-sm border border-white/5">
                      <span className="text-gray-400 font-medium">{key}</span>
                      <span className="text-white font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-white/20 rounded-sm hover:bg-white/10 transition text-white"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-white/20 rounded-sm hover:bg-white/10 transition text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addedToCart}
                  className="flex items-center justify-center space-x-2 shadow-neon-blue"
                >
                  {addedToCart ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-glow">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review._id} className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-neon-blue">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-500 font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{review.name}</p>
                          <div className="flex text-yellow-500 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No reviews yet. Be the first to review!</div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-neon-blue h-fit">
              <h3 className="text-xl font-display font-bold text-white mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Comment</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-gray-600"
                      placeholder="Share your thoughts about this product..."
                      required
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={reviewSubmitting}
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Please login to write a review.</p>
                  <Link to="/login">
                    <Button variant="outline">Login Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
