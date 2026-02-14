import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import Seo from '../components/layout/Seo';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, cartTotal, loading } = useCart();
    const navigate = useNavigate();

    if (loading) return <div className="pt-32 text-center text-white">Loading cart...</div>;

    if (cart.length === 0) {
        return (
            <div className="pt-32 pb-20 container-custom flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Seo title="Shopping Cart | MM Universal" />
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                     <ShoppingBag className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    It looks like you haven't selected a service yet. Browse our portfolio or services to get started.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/portfolio')} className="btn-primary px-8">
                        Browse Portfolio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 container-custom">
            <Seo title="Shopping Cart | MM Universal" />
            
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                <h1 className="text-3xl font-display font-bold">Shopping Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item, index) => {
                        // Normalize data
                        const img = item.image || (item.product && item.product.image) || (item.product && item.product.images && item.product.images[0]) || 'https://via.placeholder.com/150';
                        const name = item.name || (item.product && item.product.name) || 'Product';
                        const price = item.price || (item.product && item.product.basePrice) || 0;
                        const productId = item.product._id || item.product; // Handle nested or flat ID

                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-4 flex gap-6 items-center group"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt={name} className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-xl mb-1 truncate">{name}</h3>
                                    <p className="text-slate-400 text-sm mb-2">Category: {item.category || 'Digital Service'}</p>
                                    <div className="font-bold text-accent text-lg">${price}</div>
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    <button 
                                        onClick={() => removeFromCart(productId)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                     <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                                        Qty: {item.quantity}
                                     </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-6">Summary</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-accent">${cartTotal}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/checkout')}
                            className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <ArrowRight className="w-5 h-5" />
                        </button>
                        
                        <p className="text-center text-xs text-slate-500 mt-4">
                            Secure Checkout - Instant Digital Delivery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
