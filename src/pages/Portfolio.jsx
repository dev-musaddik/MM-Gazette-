import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, ShoppingBag, ShoppingCart, Eye, Smartphone, Layout } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Seo from '../components/layout/Seo';
import { toast } from 'react-hot-toast';

const Portfolio = () => {
    const [filter, setFilter] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const categories = ['All', 'Website', 'E-commerce', 'Enterprise', 'UI/UX Design', 'Mobile Apps'];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProjects(data.data || []);
        } catch (err) {
            console.error("Failed to load portfolio", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (e, project) => {
        e.stopPropagation(); // Prevent card click if any
        await addToCart(project);
        toast.success(`Added ${project.name} to cart!`);
    };

    const filteredProjects = filter === 'All' 
        ? projects 
        : projects.filter(p => p.category === filter);

    return (
        <div className="pt-24 min-h-screen container-custom pb-20">
            <Seo 
                title="Web Design Portfolio & Success Stories | MM Universal"
                description="View our latest work in web design, e-commerce, and mobile apps. Buy high-quality ready-made digital assets."
                keywords="web design portfolio, website examples, buy ready made websites, digital assets store"
            />

            {/* Hero */}
            <div className="text-center max-w-4xl mx-auto mb-20 relative">
                 {/* Decor elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />

                <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="text-accent uppercase tracking-widest text-sm font-bold"
                >
                    Premium Digital Assets
                </motion.span>
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 leading-tight text-foreground"
                >
                    Explore. <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-muted-foreground to-muted">Experience.</span> <span className="text-gradient-gold">Own.</span>
                </motion.h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    A curated collection of high-performance websites and applications. 
                    Ready to launch your brand instantly.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border backdrop-blur-md ${
                            filter === cat 
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                            : 'bg-card text-muted-foreground border-border hover:bg-accent/10 hover:text-foreground hover:border-accent/40'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.4 }}
                                    key={project._id}
                                    className="group relative rounded-3xl overflow-hidden glass-card hover:shadow-xl transition-all duration-500"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 transition-opacity duration-500" />
                                        
                                        <img 
                                            src={project.image || (project.images && project.images[0]) || 'https://via.placeholder.com/800x600?text=No+Image'} 
                                            alt={project.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border shadow-lg ${
                                                project.status === 'Sold' ? 'bg-red-500/80 text-white border-red-500/50' :
                                                project.status === 'In Development' ? 'bg-yellow-500/80 text-black border-yellow-500/50' :
                                                'bg-accent text-white border-accent/50 box-glow'
                                             }`}>
                                                {project.status || 'For Sale'}
                                             </span>
                                        </div>

                                        {/* Category Badge */}
                                         <div className="absolute top-4 right-4 z-20">
                                             <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/50 text-white border border-white/10">
                                                {project.category}
                                             </span>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6 relative z-20 -mt-12">
                                        <div className="glass-card p-6 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-lg">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                                                    {project.name}
                                                </h3>
                                                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                                                    ${project.basePrice}
                                                </div>
                                            </div>
                                            
                                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 h-10">
                                                {project.description}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {project.demoUrl ? (
                                                        <a 
                                                            href={project.demoUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-accent/10 hover:text-accent transition-all hover:scale-[1.02]"
                                                        >
                                                            <Eye className="w-4 h-4" /> Demo
                                                        </a>
                                                    ) : (
                                                        <button disabled className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-xs font-medium text-muted-foreground cursor-not-allowed">
                                                            <Eye className="w-4 h-4" /> No Demo
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={(e) => handleAddToCart(e, project)}
                                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-all hover:scale-[1.02] active:scale-95"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> Add
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => navigate(`/checkout?productId=${project._id}`)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95"
                                                >
                                                    Buy Now <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* CTA */}
            <div className="mt-32 relative rounded-3xl overflow-hidden bg-gradient-to-r from-accent/20 to-blue-600/20 border border-white/10 p-12 text-center">
                 <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Need a Custom Solution?</h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                    If you don't see what you're looking for, our team can build a bespoke digital experience tailored exactly to your brand.
                </p>
                <Link to="/contact" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-accent/20 inline-flex items-center gap-2">
                    Start Custom Project <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
};

export default Portfolio;
