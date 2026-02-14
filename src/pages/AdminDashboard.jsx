import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        // In real app, verify token or fetch admin stats here
    }, [navigate]);

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, Admin.</p>
                </div>
                {/* Actions */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Total Services</p>
                        <h3 className="text-3xl font-bold mt-1 text-foreground">24</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Package />
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Active Orders</p>
                        <h3 className="text-3xl font-bold mt-1 text-foreground">12</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <ShoppingCart />
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Total Clients</p>
                        <h3 className="text-3xl font-bold mt-1 text-foreground">128</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                        <Users />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold mb-6 text-foreground">Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6 hover:bg-accent/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <Package className="w-6 h-6 text-accent" />
                        <h3 className="text-xl font-bold text-foreground">Manage Services & Products</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                        Edit service descriptions, update pricing, and manage your portfolio items.
                    </p>
                    <span className="text-accent text-sm font-medium group-hover:underline">View All Products →</span>
                </div>

                <div className="glass-card p-6 hover:bg-accent/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <Settings className="w-6 h-6 text-blue-500" />
                        <h3 className="text-xl font-bold text-foreground">Site Settings</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                        Update general site information, SEO metadata, and contact details.
                    </p>
                    <span className="text-blue-500 text-sm font-medium group-hover:underline">Configure Settings →</span>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
