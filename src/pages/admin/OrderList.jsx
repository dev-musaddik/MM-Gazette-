import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch('/api/orders/admin/all', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            const data = await res.json();
            // Controller returns { success: true, count: X, data: [...] }
            setOrders(data.data || []);
        } catch (err) {
            console.error("Failed to fetch orders (Admin needs to be logged in and authorized)", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gold bg-gold/10 border-gold/20'; // Pending
        }
    };

    return (
        <AdminLayout>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Client Orders</h1>
                    <p className="text-slate-400 mt-1">Track and manage service requests.</p>
                </div>
            </div>

             <div className="glass-card overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-medium text-slate-400">Order ID</th>
                                <th className="p-4 font-medium text-slate-400">Client</th>
                                <th className="p-4 font-medium text-slate-400">Source</th>
                                <th className="p-4 font-medium text-slate-400">Date</th>
                                <th className="p-4 font-medium text-slate-400">Total</th>
                                <th className="p-4 font-medium text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm">
                                            <Link to={`/admin/orders/${order._id}`} className="text-accent hover:underline">
                                                #{order._id.substring(order._id.length - 8)}
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</div>
                                            <div className="text-xs text-slate-500">{order.user?.email || order.shippingAddress?.email || '-'}</div>
                                        </td>
                                        <td className="p-4">
                                            {order.landingPage ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    {order.landingPage.title}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">Main Store</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-bold text-white">${order.totalAmount}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderList;
