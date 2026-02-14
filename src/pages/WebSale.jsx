import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Server, Shield, Smartphone } from 'lucide-react';

import Head from '../components/layout/Seo';

const WebSale = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            setUserInfo(JSON.parse(user));
        }
    }, []);

    // Mock data if backend is empty or not running for demo
    const mockProducts = [
        {
            _id: '1',
            name: 'Business Starter',
            description: 'Perfect for small businesses. Includes 5 pages, contact form, and mobile responsive design.',
            basePrice: 499,
            category: 'Website',
            features: ['5 Pages', 'Mobile Responsive', 'Contact Form', 'Basic SEO'],
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            _id: '2',
            name: 'E-commerce Pro',
            description: 'Full online store with payment gateway, product management, and customer dashboard.',
            basePrice: 1299,
            category: 'E-commerce',
            features: ['Unlimited Products', 'Payment Gateway', 'Admin Dashboard', 'Customer Login'],
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            _id: '3',
            name: 'Custom Enterprise',
            description: 'Tailored solution for large organizations. Custom features, advanced security, and scalability.',
            basePrice: 2999,
            category: 'Enterprise',
            features: ['Custom Features', 'Advanced Security', 'Scalable Architecture', 'Dedicated Support'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
    ];

    useEffect(() => {
        // Fetch products from backend
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data && data.data) { 
                    setProducts(data.data);
                } else {
                    setProducts(mockProducts); // Fallback to mock
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
                setProducts(mockProducts); // Fallback
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    const productSchema = {
        "@type": "Product",
        "name": "Professional Web Design Package",
        "description": "Custom website design and development services starting at $499.",
        "image": "https://mmuniversal.com/og-image.jpg",
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "499",
            "highPrice": "2999",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="pt-32 pb-20 container-custom">
            <Head 
                title="Affordable Web Design Packages | Web Sale"
                description="Get a professional custom website starting at $499. Perfect for small businesses and e-commerce. limited time offers."
                keywords="affordable web design, buy website, cheap website builder, ecommerce website package, business website sale"
                schema={productSchema}
            />
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-accent font-medium tracking-wider text-sm uppercase">Premium Digital Assets</span>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 mt-2">
                    Web Sale & <span className="text-gradient-gold">Solutions</span>
                </h1>
                <p className="text-slate-400 text-lg">
                    Launch your digital presence today with our professionally crafted website packages and digital services.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-white">Loading premium assets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card overflow-hidden group hover:border-accent/30 transition-all duration-300"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark to-transparent z-10 opacity-60" />
                                <img 
                                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/500'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {product.category || 'Service'}
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <h3 className="text-2xl font-bold font-display mb-2">{product.name}</h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                                
                                <ul className="space-y-3 mb-8">
                                    {(product.features || ['Premium Design', 'SEO Optimized', 'Fast Loading']).slice(0, 4).map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-slate-300">
                                            <Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-wider">Starting at</p>
                                        <p className="text-2xl font-bold text-white">${product.basePrice}</p>
                                    </div>
                                    <Link to={`/checkout?productId=${product._id}`} className="btn-primary py-2 px-6 text-sm">
                                        Order Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            
            {/* Complementary Services (Interlinking) */}
            <div className="mt-20 border-t border-white/10 pt-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Complete Your Digital Presence</h2>
                    <p className="text-slate-400">Combine these services for maximum impact.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Link to="/services/design" className="glass-card p-8 hover:border-pink-500/50 transition-colors group text-center">
                        <div className="w-12 h-12 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-500">
                           <Smartphone className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">UI/UX Design</h3>
                        <p className="text-slate-400 text-sm">Premium aesthetics to match your new website's functionality.</p>
                    </Link>
                    <Link to="/services" className="glass-card p-8 hover:border-blue-500/50 transition-colors group text-center">
                         <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-500">
                           <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Digital Marketing</h3>
                        <p className="text-slate-400 text-sm">Drive traffic to your new site with SEO and campaigns.</p>
                    </Link>
                </div>
            </div>

            {/* Admin Shortcuts */}
            {userInfo && userInfo.isAdmin && (
                <div className="mt-20 p-8 border border-white/10 rounded-2xl bg-white/5 text-center">
                    <h3 className="text-xl font-bold mb-4">Admin Dashboard</h3>
                    <p className="text-slate-400 mb-6">Manage your products, view orders, and receive notifications.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/admin/products" className="btn-outline">Create New Product</Link>
                        <Link to="/admin/orders" className="btn-outline">View Orders</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebSale;
