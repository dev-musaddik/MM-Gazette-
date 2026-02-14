import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Mail, Menu, X } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Messages', path: '/admin/messages', icon: Mail },
        { name: 'LP Leads', path: '/admin/landing-pages/leads', icon: Users }, // dedicated leads
        { name: 'Blog', path: '/admin/blog', icon: LayoutDashboard }, // Can import FileText if available
        { name: 'Landing Pages', path: '/admin/landing-pages', icon: Package }, // Reusing Package icon for now
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-background flex pt-20 transition-colors duration-300 relative">
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-24 left-4 z-50 p-2 rounded-md bg-card border border-border text-foreground shadow-md"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 fixed h-full border-r border-border bg-card/95 backdrop-blur-sm 
                flex flex-col z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                inset-y-0 left-0 pt-20 lg:pt-0
            `}>
                <div className="p-6 hidden lg:block">
                    <h2 className="text-xl font-display font-bold text-foreground tracking-tight">Admin <span className="text-accent">Panel</span></h2>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4 lg:mt-0">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-accent/10 text-accent' 
                                    : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-8 overflow-y-auto bg-background text-foreground transition-colors duration-300 w-full">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
