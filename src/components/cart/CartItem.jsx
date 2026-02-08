import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';

/**
 * CartItem Component
 * Displays cart item with image, details, quantity controls, and remove button
 */
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId: item._id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
  };

  const product = item.product;
  const imageUrl = product?.images?.[0] || '/placeholder-product.jpg';
  const itemTotal = (product?.basePrice || 0) * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-primary-500/30 transition group">
      {/* Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0">
        <img
          src={imageUrl}
          alt={product?.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-500 transition-colors">{product?.name}</h3>
        <p className="text-sm text-gray-400 mb-2 capitalize">
          {product?.category?.replace('-', ' ')}
        </p>

        {/* Options */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-3">
          {item.size && (
            <span className="px-2 py-1 bg-white/10 rounded">Size: {item.size}</span>
          )}
          {item.color && (
            <span className="px-2 py-1 bg-white/10 rounded">Color: {item.color}</span>
          )}
          {item.material && (
            <span className="px-2 py-1 bg-white/10 rounded">Material: {item.material}</span>
          )}
          {item.customDesign?.imageUrl && (
            <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded font-medium">
              Custom Design
            </span>
          )}
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-primary-500">
          ${itemTotal.toFixed(2)}
          <span className="text-sm font-normal text-gray-500 ml-2">
            (${product?.basePrice?.toFixed(2)} each)
          </span>
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
        <div className="flex items-center space-x-2 border border-white/10 rounded-lg bg-black/20">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="p-2 hover:bg-white/10 transition rounded-l-lg text-gray-400 hover:text-white"
            disabled={item.quantity <= 1}
          >
            <FiMinus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="p-2 hover:bg-white/10 transition rounded-r-lg text-gray-400 hover:text-white"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Button */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleRemove}
          className="flex items-center space-x-1"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
