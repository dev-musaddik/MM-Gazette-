import { useState, useEffect } from 'react';
import { Search, Package, CheckCircle, Clock, XCircle, ChevronRight, User } from 'lucide-react';
import Seo from '../components/layout/Seo';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // User History State
    const [userOrders, setUserOrders] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserInfo(parsedUser);
            fetchUserHistory(parsedUser);
        } else {
            setHistoryLoading(false);
        }
    }, []);

    const fetchUserHistory = async (user) => {
        try {
            const res = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUserOrders(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        // Strip '#' if user included it
        const cleanId = orderId.replace('#', '').trim();

        try {
            // Use the public tracking endpoint
            const res = await fetch(`/api/orders/track/${cleanId}`);
            const data = await res.json();

            if (res.ok) {
                setOrder(data.data);
            } else {
                setError(data.message || 'Order not found. Please check the ID.');
            }
        } catch (err) {
            setError('Failed to track order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentLower = status?.toLowerCase();
        
        // Handle variations
        if (currentLower === 'completed') return 4;
        if (currentLower === 'cancelled') return -1;
        
        return steps.indexOf(currentLower) + 1; // 1-based index
    };

    const currentStep = order ? getStatusStep(order.status) : 0;

    return (
        <div className="pt-32 min-h-screen container-custom pb-20 text-white">
            <Seo title="Track Your Order | MM Universal" />
            
            <div className="max-w-xl mx-auto text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Track Order</h1>
                <p className="text-slate-400">Enter your Order ID found in your confirmation email.</p>
            </div>

            {/* Search Section */}
            <div className="max-w-xl mx-auto mb-16">
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Order ID (e.g. 64f...)"
                        className="w-full glass-card border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all bg-black/40"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
                        {error}
                    </div>
                )}
            </div>

            {/* Search Result */}
            {order && (
                <div className="max-w-2xl mx-auto glass-card p-8 border border-white/10 animate-fade-in-up mb-20 bg-black/40">
                    <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-1 text-white">Order Status</h2>
                            <p className="text-slate-400 text-sm">ID: <span className="font-mono text-accent">#{order._id}</span></p>
                        </div>
                        <div className="text-right">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                                order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-accent/20 text-accent'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative mb-12 px-4">
                        {order.status === 'cancelled' ? (
                            <div className="text-center text-red-400 py-8">
                                <XCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">This order has been cancelled.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/10 -z-10" />
                                {[
                                    { label: 'Order Placed', step: 1 },
                                    { label: 'Processing', step: 2 },
                                    { label: 'Shipped / Delivered', step: 3 },
                                    { label: 'Completed', step: 4 },
                                ].map((s, i) => {
                                    const isCompleted = currentStep >= s.step;
                                    const isCurrent = currentStep === s.step;
                                    
                                    return (
                                        <div key={i} className="flex items-center gap-6">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                                isCompleted ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 
                                                'bg-black border-white/10 text-slate-500'
                                            }`}>
                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            <div className={`${isCompleted ? 'text-white' : 'text-slate-500'} transition-colors duration-500`}>
                                                <h4 className="font-bold text-lg">{s.label}</h4>
                                                {isCurrent && <p className="text-xs text-accent animate-pulse">In Progress</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm pt-8 border-t border-white/10">
                        <div>
                            <span className="text-slate-400 block mb-1">Shipping To</span>
                            <p className="font-bold text-white">{order.shippingAddress?.fullName}</p>
                            <p className="text-slate-300">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        </div>
                        <div className="text-right md:text-left">
                            <span className="text-slate-400 block mb-1">Total Amount</span>
                            <p className="font-bold text-2xl text-white">${order.totalAmount}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order History for Logged In Users */}
            {userInfo && (
                <div className="max-w-4xl mx-auto border-t border-white/10 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <User className="w-6 h-6 text-accent" />
                        <h2 className="text-2xl font-display font-bold text-white">Your Order History</h2>
                    </div>

                    {historyLoading ? (
                        <div className="text-center text-slate-400 py-10">Loading your history...</div>
                    ) : userOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userOrders.map((histOrder) => (
                                <div 
                                    key={histOrder._id}
                                    onClick={() => {
                                        setOrderId(histOrder._id);
                                        setOrder(histOrder);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="glass-card p-6 border border-white/10 hover:border-accent/40 hover:bg-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-mono text-xs text-accent mb-1">#{histOrder._id.substring(histOrder._id.length - 8)}</div>
                                            <div className="font-bold text-white text-lg">{histOrder.items.length} Item(s)</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            histOrder.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-400'
                                        }`}>
                                            {histOrder.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm text-slate-400">
                                            {new Date(histOrder.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            ${histOrder.totalAmount}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-400 group-hover:text-accent transition-colors">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass-card border border-white/10 rounded-2xl">
                            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Past Orders</h3>
                            <p className="text-slate-400 mb-6">You haven't placed any orders yet.</p>
                            <Link to="/portfolio" className="btn-primary px-6 py-2">Start Shopping</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
