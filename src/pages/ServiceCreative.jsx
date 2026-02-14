import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, Video, MonitorPlay, Layers, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Head from '../components/layout/Seo';

const ServiceCreative = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const designFeatures = [
        "Professional Logo Design",
        "Social Media Banners & Posts",
        "Canva Template Customization",
        "Brand Identity Kits",
        "Marketing Flyers & Posters",
        "YouTube Thumbnails"
    ];

    const videoFeatures = [
        "Social Media Reels & TikToks",
        "Basic YouTube Video Editing",
        "Corporate Presentation Videos",
        "Event Highlights",
        "Adding Subtitles & Captions",
        "Color Correction & Grading"
    ];

    return (
        <div className="pt-24 min-h-screen">
             <Head 
                title="Creative Services: Design & Video | MM Universal"
                description="Affordable graphic design and video editing services. Logos, banners, social media content, and basic video post-production."
                keywords="graphic design, video editing, logo design, canva designer, youtube editor, social media content"
            />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" 
                        alt="Creative Workspace" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                <div className="container-custom relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-6 border border-pink-500/20">
                            Visual Storytelling
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
                            Bring Your Vision <br /> to Life
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            High-quality graphic design and video editing services tailored for creators, small businesses, and brands.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/contact" className="btn-primary py-4 px-8 text-lg w-full sm:w-auto">
                                Start a Project <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link to="/portfolio" className="btn-outline py-4 px-8 text-lg w-full sm:w-auto">
                                View Our Work
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

             {/* Graphic Design Section */}
             <section className="py-24 relative overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
                            <div className="relative aspect-video rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black overflow-hidden flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                <Palette className="w-24 h-24 text-pink-500/50 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </motion.div>
                        
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                    Graphic <span className="text-pink-500">Design</span>
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    We create stunning visuals that capture attention and communicate your brand's message effectively. From logos to social media kits, we handle it all.
                                </p>
                            </div>

                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                            >
                                {designFeatures.map((feature, idx) => (
                                    <motion.div 
                                        key={idx}
                                        variants={{
                                            hidden: { opacity: 0, x: 20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                                            <Palette className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-200">{feature}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Video Editing Section */}
             <section className="py-24 bg-secondary/30 relative overflow-hidden" ref={targetRef}>
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                         <div className="order-2 lg:order-1 space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                    Video <span className="text-blue-500">Editing</span>
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Transform raw footage into polished, engaging content. Perfect for YouTubers, influencers, and businesses needing quick turnaround video assets.
                                </p>
                            </div>

                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                            >
                                {videoFeatures.map((feature, idx) => (
                                    <motion.div 
                                        key={idx}
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-200">{feature}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                         <motion.div 
                            style={{ y }}
                            className="order-1 lg:order-2 relative"
                        >
                             <div className="absolute -inset-4 bg-gradient-to-l from-blue-500 to-cyan-600 rounded-2xl blur-2xl opacity-20" />
                            <div className="relative aspect-video rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black overflow-hidden flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                <Video className="w-24 h-24 text-blue-500/50 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

             {/* CTA Section */}
             <section className="py-32 relative text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/10 pointer-events-none" />
                <div className="container-custom relative z-10 px-4">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                        Ready to Create?
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                        Let's collaborate to build the visual assets your brand deserves. 
                        Fast delivery and professional quality guaranteed.
                    </p>
                    <Link to="/contact" className="btn-primary py-5 px-10 text-xl shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-shadow">
                        Get a Free Quote
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ServiceCreative;
