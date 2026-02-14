import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data.data);
            } else {
                console.error("Failed to fetch order");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        
        setUpdating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                fetchOrder(); // Refresh data
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Failed to update status");
            }
        } catch (err) {
            alert("Error updating status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="text-center p-10 text-slate-400">Loading order details...</div>
        </AdminLayout>
    );

    if (!order) return (
        <AdminLayout>
            <div className="text-center p-10 text-red-500">Order not found</div>
        </AdminLayout>
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gold bg-gold/10 border-gold/20';
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-display font-bold">Order Details</h1>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        ID: <span className="font-mono text-white">#{order._id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    {order.status !== 'completed' && (
                        <button 
                            disabled={updating}
                            onClick={() => updateStatus('completed')}
                            className="btn-primary bg-green-600 hover:bg-green-700 border-none text-xs px-4 py-2"
                        >
                            Mark Completed
                        </button>
                    )}
                    {order.status !== 'cancelled' && (
                        <button 
                             disabled={updating}
                             onClick={() => updateStatus('cancelled')}
                             className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-xs"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="glass-card p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-accent" /> Order Items
                        </h3>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
                                        {/* Ideally fetch product image, for now using placeholder or if stored in item */}
                                         <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Product Img</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{item.name || 'Product'}</h4>
                                        <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                        
                                        {/* Specs/Customizations if any */}
                                        {/* <div className="mt-2 flex flex-wrap gap-2">
                                            {item.size && <span className="text-xs px-2 py-1 bg-white/5 rounded">Size: {item.size}</span>}
                                        </div> */}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">${item.price}</div>
                                        <div className="text-sm text-slate-400">Total: ${item.price * item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${order.totalAmount - (order.deliveryCharge || 0)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Delivery/Service Fee</span>
                                <span>${order.deliveryCharge || 0}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-white mt-2 pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span>${order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Fraud Check (Optional, if we had it) */}
                    <div className="glass-card p-6 border border-white/10">
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-accent" /> Risk Analysis
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-400 text-sm block">IP Address</span>
                                <span className="font-mono">{order.ipAddress || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm block">Fraud Score</span>
                                <span className={`font-bold ${order.fraudScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                    {order.fraudScore || 0}/100
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="glass-card p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" /> Customer Details
                        </h3>
                         <div className="space-y-4">
                            <div>
                                <span className="text-slate-400 text-sm block">Name</span>
                                <span className="text-white font-medium">{order.shippingAddress?.fullName}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm block">Email</span>
                                <a href={`mailto:${order.user?.email || order.shippingAddress?.email}`} className="text-accent hover:underline break-all">
                                    {order.user?.email || 'N/A'}
                                </a>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm block">Phone</span>
                                <span className="text-white">{order.shippingAddress?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="glass-card p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent" /> Shipping Address
                        </h3>
                        <div className="space-y-2 text-slate-300">
                           <p>{order.shippingAddress?.address}</p>
                           <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                           <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="glass-card p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-accent" /> Payment Info
                        </h3>
                         <div className="space-y-3">
                            <div>
                                <span className="text-slate-400 text-sm block">Method</span>
                                <span className="text-white">{order.paymentMethod}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm block">Payment Status</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {order.paymentStatus || 'Pending'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm block">Date Placed</span>
                                <span className="text-white text-sm">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetails;
