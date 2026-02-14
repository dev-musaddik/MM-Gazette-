import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';
import Seo from '../components/layout/Seo';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('productId');
    const { cart, clearCart } = useCart();
    
    // State
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Cash on Delivery'
    });

    // 1. Load User
    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserInfo(parsedUser);
            setFormData(prev => ({
                ...prev,
                fullName: parsedUser.name,
                email: parsedUser.email
            }));
        }
    }, []);

    // 2. Initialize Items (Cart vs Single Product)
    useEffect(() => {
        const initializeCheckout = async () => {
            setLoading(true);
            
            if (productId) {
                // Mode A: Single Product (Buy Now)
                try {
                    const res = await fetch(`/api/products/${productId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const product = data.data || data.product || data;
                        
                        // Normalize to item structure
                        setItems([{
                            product: product._id,
                            name: product.name,
                            price: product.basePrice,
                            quantity: 1,
                            image: product.image || (product.images && product.images[0])
                        }]);
                        setTotalPrice(product.basePrice);
                        setTotalPrice(product.basePrice);
                    } else {
                         setError("Product not found. Please select a valid product.");
                         setLoading(false);
                    }
                } catch (err) {
                     console.error(err);
                     setError("Failed to load product details.");
                     setLoading(false);
                }
            } else {
                // Mode B: Cart Checkout
                // Normalize cart items (handle both guest flat structure and logged-in nested structure)
                const normalizedItems = cart.map(cartItem => {
                    const isPopulated = cartItem.product && typeof cartItem.product === 'object';
                    if (isPopulated) {
                        return {
                            product: cartItem.product._id,
                            name: cartItem.product.name,
                            price: cartItem.product.basePrice,
                            image: cartItem.product.image || (cartItem.product.images && cartItem.product.images[0]),
                            quantity: cartItem.quantity
                        };
                    }
                    return {
                        product: cartItem.product,
                        name: cartItem.name,
                        price: cartItem.price || cartItem.basePrice, // usage of basePrice or price
                        image: cartItem.image,
                        quantity: cartItem.quantity
                    };
                });

                setItems(normalizedItems);
                
                // Calculate total using normalized items
                const total = normalizedItems.reduce((acc, item) => {
                    const price = Number(item.price) || 0;
                    return acc + (price * item.quantity);
                }, 0);
                
                setTotalPrice(total);
            }
            setLoading(false);
        };

        initializeCheckout();
    }, [productId, cart]); // Re-run if cart changes (e.g. initial load)



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (items.length === 0) {
            toast.error('Your cart or order is empty.');
            setSubmitting(false);
            return;
        }

        const toastId = toast.loading('Processing order...');

        try {
            // Prepare items for backend
            const orderItems = items.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const orderData = {
                items: orderItems,
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                paymentMethod: formData.paymentMethod,
                deliveryCharge: 0
            };

            const endpoint = userInfo ? '/api/orders' : '/api/orders/guest';
            const headers = { 'Content-Type': 'application/json' };
            if (userInfo) {
                headers['Authorization'] = `Bearer ${userInfo.token}`;
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Order placed successfully!', { id: toastId });
                // If cart checkout, clear global cart
                if (!productId) {
                    await clearCart();
                }
                navigate(`/order-success/${data.data._id}`);
            } else {
                toast.error(data.message || 'Order failed', { id: toastId });
                setError(data.message || 'Order failed. Please try again.');
            }
        } catch (err) {
            console.error("Order submission error:", err);
            toast.error(err.message || 'Order failed', { id: toastId });
            setError(err.message || 'Order failed. Please check your details.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="pt-32 text-center text-white">Loading checkout...</div>;
    
    // Empty State Check
    if (items.length === 0 && !loading) return (
        <div className="pt-32 pb-20 container-custom flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <CreditCard className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-slate-400 max-w-md mb-8">
                It looks like you haven't selected a service yet. Browse our portfolio or services to get started.
            </p>
            <div className="flex gap-4">
                <button onClick={() => navigate('/portfolio')} className="btn-primary px-8">
                    Browse Portfolio
                </button>
                <button onClick={() => navigate('/services')} className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors">
                    View Services
                </button>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 container-custom">
            <Seo title="Checkout | MM Universal" />
            
            <h1 className="text-3xl font-display font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Secure Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1 order-2 lg:order-2">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar mb-4 pr-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-4 mb-4 border-b border-white/10 pb-4 last:border-0 last:mb-0 last:pb-0">
                                    <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                        <img 
                                            src={item.image || 'https://via.placeholder.com/150'} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold text-sm">${item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mb-2 text-slate-400">
                            <span>Subtotal</span>
                            <span>${totalPrice}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-slate-400">
                            <span>Tax (Estimated)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-white/10 font-bold text-lg text-accent">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                        
                        <div className="mt-6 space-y-3 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Payment
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-500" /> Instant Delivery (Digital)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="lg:col-span-2 order-1 lg:order-1">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-6">Billing Details</h3>
                        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Full Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Email Address</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Phone Number</label>
                                <input required name="phone" value={formData.phone} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Address</label>
                                <input required name="address" value={formData.address} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">City</label>
                                    <input required name="city" value={formData.city} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Postal Code</label>
                                    <input required name="postalCode" value={formData.postalCode} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Country</label>
                                    <input required name="country" value={formData.country} onChange={handleChange} className="input-field w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-accent outline-none text-white" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border border-accent rounded-lg bg-accent/10 cursor-pointer">
                                        <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} className="text-accent focus:ring-accent" />
                                        <div className="flex-1">
                                            <span className="font-bold block">Cash on Delivery / Invoice</span>
                                            <span className="text-sm text-slate-400">Pay after project initiation/audit.</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg opacity-50 cursor-not-allowed">
                                        <input type="radio" disabled />
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="font-medium text-slate-400">Credit Card (Coming Soon)</span>
                                            <CreditCard className="w-5 h-5 text-slate-500" />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button disabled={submitting} type="submit" className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-accent/20 mt-6">
                                {submitting ? 'Processing...' : `Place Order - $${totalPrice}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
