import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Palette, Layout, Smartphone, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Head from '../components/layout/Seo';

const ServiceDesign = () => {
    const [products, setProducts] = useState([]);
    const portfolioRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
                // Filter for relevant categories if needed, for now showing all or limit to 6
                setProducts(data.data?.slice(0, 6) || []);
            }
        } catch (err) {
            console.error('Failed to fetch products');
        }
    };

    const scrollToPortfolio = () => {
        portfolioRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pt-24 min-h-screen container-custom pb-20">
            <Head 
                title="Premium UI/UX Design Services & Branding | MM Universal"
                description="Transform your digital presence with our expert UI/UX design services. Mobile-first, user-centric designs that convert."
                keywords="ui/ux design, branding, web design, app design, user interface, user experience"
                schema={{
                    "@type": "Service",
                    "name": "UI/UX Design",
                    "provider": { "@type": "Organization", "name": "MM Universal" },
                    "areaServed": "Worldwide"
                }}
            />
            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                        className="text-pink-500 uppercase tracking-widest text-sm font-bold"
                    >
                        Premium Aesthetics
                    </motion.span>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 leading-tight"
                    >
                        UI/UX <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Mastery.</span>
                    </motion.h1>
                    <p className="text-slate-400 text-lg mb-8">
                        We craft intuitive, engaging, and beautiful digital experiences that captivate your audience.
                    </p>
                    <button onClick={scrollToPortfolio} className="btn-primary">View Portfolio</button>
                </div>
                
                {/* Visual Demo */}
                <div className="relative h-[500px] w-full">
                    <motion.div 
                        initial={{ rotate: -5, y: 20 }}
                        animate={{ rotate: 0, y: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute top-10 left-10 w-64 h-80 bg-gradient-to-br from-slate-800 to-black border border-white/10 rounded-2xl shadow-2xl z-10 p-4"
                    >
                        <div className="w-full h-32 bg-slate-700/50 rounded-lg mb-4 animate-pulse"></div>
                        <div className="w-3/4 h-4 bg-slate-700/50 rounded mb-2"></div>
                        <div className="w-1/2 h-4 bg-slate-700/50 rounded"></div>
                    </motion.div>

                    <motion.div 
                        initial={{ rotate: 5, x: 20 }}
                        animate={{ rotate: 0, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute top-20 right-10 w-64 h-80 bg-gradient-to-br from-white to-slate-200 text-black border border-white/10 rounded-2xl shadow-2xl z-20 p-4"
                    >
                         <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                         </div>
                         <div className="w-full h-24 bg-blue-100 rounded-lg mb-4"></div>
                         <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                            <div className="w-20 h-2 bg-slate-200"></div>
                         </div>
                    </motion.div>
                </div>
            </div>

            {/* Design Principles / Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { icon: Layout, title: "Wireframing", desc: "Strategic layout planning for optimal user flow." },
                    { icon: Palette, title: "Visual Design", desc: "Pixel-perfect aesthetics aligned with your brand." },
                    { icon: Smartphone, title: "Responsiveness", desc: "Flawless experience across all devices." },
                ].map((item, i) => (
                    <div key={i} className="glass-card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-pink-500">
                            <item.icon className="w-8 h-8" />
                        </div>
                        {/* Backend Connected Packages would go here similar to SEO page */}
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                    </div>
                ))}
            </div>

             {/* Selected Works Section */}
            <div ref={portfolioRef} className="mb-24 scroll-mt-24">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Selected <span className="text-pink-500">Works</span></h2>
                
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <motion.div 
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-card overflow-hidden group hover:border-pink-500/50 transition-colors"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <img 
                                        src={product.image || product.images?.[0] || 'https://via.placeholder.com/400'} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-xs font-bold text-pink-400 uppercase tracking-widest bg-black/50 backdrop-blur px-2 py-1 rounded-sm mb-2 inline-block">
                                            {product.category || 'Design'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">{product.name}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                       <span className="font-bold text-lg">${product.basePrice}</span>
                                       <a href={`/checkout?productId=${product._id}`} className="btn-outline text-xs px-4 py-2 hover:bg-pink-500 hover:text-white hover:border-pink-500">
                                            View Project <ArrowRight className="w-3 h-3 ml-1 inline" />
                                       </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500 glass-card">
                        <p>Loading portfolio items...</p>
                    </div>
                )}
            {/* Interlinking Section */}
            <div className="mt-20 border-t border-white/10 pt-16">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Bring Your Designs to <span className="text-blue-500">Life</span></h2>
                    <p className="text-slate-400">Seamlessly move from design to development.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                     <Link to="/web-sale" className="glass-card p-8 hover:border-blue-500/50 transition-colors group text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-500">
                           <Layout className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Web Development</h3>
                        <p className="text-slate-400 text-sm">Get your designs built with pixel-perfect precision.</p>
                    </Link>
                     <Link to="/contact" className="glass-card p-8 hover:border-green-500/50 transition-colors group text-center">
                        <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500">
                           <ArrowRight className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Start Project</h3>
                        <p className="text-slate-400 text-sm">Ready to build? Let's discuss your requirements.</p>
                    </Link>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDesign;
