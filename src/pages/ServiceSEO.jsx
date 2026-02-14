import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Search, Globe, ArrowRight } from 'lucide-react';

const ServiceSEO = () => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        // Fetch SEO packages from backend
        // In a real scenario, filter by category='SEO'
        const fetchPackages = async () => {
            try {
                const res = await fetch('/api/products?category=SEO');
                const data = await res.json();
                if (data.products) setPackages(data.products);
            } catch (err) {
                console.error(err);
                // Fallback mock
                setPackages([
                    { name: 'Basic Audit', description: 'Technical analysis and keyword research.', basePrice: 299 },
                    { name: 'Growth Monthly', description: 'Ongoing optimization and content strategy.', basePrice: 899 },
                ]);
            }
        };
        fetchPackages();
    }, []);

    const stats = [
        { label: 'Organic Traffic', value: '+150%', delay: 0 },
        { label: 'Keyword Rankings', value: 'Top 3', delay: 0.2 },
        { label: 'Conversion Rate', value: '3.5x', delay: 0.4 },
    ];

    return (
        <div className="pt-24 min-h-screen container-custom pb-20">
            {/* Hero */}
            <div className="text-center max-w-4xl mx-auto mb-20">
                <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="text-accent uppercase tracking-widest text-sm font-bold"
                >
                    Digital Growth Engine
                </motion.span>
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6"
                >
                    SEO & <span className="text-gradient-gold">Performance</span>
                </motion.h1>
                <p className="text-slate-400 text-lg">
                    Data-driven strategies to dominate search results and drive revenue.
                </p>
            </div>

            {/* Interactive Demo: Growth Chart */}
            <div className="glass-card p-8 mb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <TrendingUp className="w-32 h-32 text-accent/10" />
                </div>
                <h3 className="text-2xl font-bold mb-8 font-display">Performance Projection</h3>
                
                <div className="flex flex-col md:flex-row items-end gap-8 h-64 w-full max-w-3xl mx-auto pb-4 border-b border-white/10">
                    {[30, 45, 60, 85, 100].map((height, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="w-full bg-gradient-to-t from-accent/20 to-accent rounded-t-lg relative group"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-accent font-bold">
                                {height * 100} Visits
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between max-w-3xl mx-auto mt-4 text-slate-500 text-sm">
                    <span>Month 1</span>
                    <span>Month 2</span>
                    <span>Month 3</span>
                    <span>Month 4</span>
                    <span>Month 5</span>
                </div>
            </div>

            {/* Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, i) => (
                    <div key={i} className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <Search className="w-10 h-10 text-gold mb-6" />
                        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                        <p className="text-slate-400 mb-6">{pkg.description}</p>
                        <p className="text-2xl font-bold text-white mb-6">${pkg.basePrice}</p>
                        <button className="btn-outline w-full text-sm">View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceSEO;
