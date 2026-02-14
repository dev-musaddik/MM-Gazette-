import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BarChart2, DollarSign, Facebook, Instagram, Search } from 'lucide-react';
import Seo from '../components/layout/Seo';

const ServiceAds = () => {
    // Interactive demo state (mock campaign data)
    const [selectedPlatform, setSelectedPlatform] = useState('Google');
    
    const platforms = {
        Google: {
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            ctr: '4.2%',
            cpc: '$0.85',
            conversions: '1,240',
            roi: '380%'
        },
        Facebook: {
            color: 'text-blue-600',
            bg: 'bg-blue-600/10',
            ctr: '2.8%',
            cpc: '$0.45',
            conversions: '3,500',
            roi: '420%'
        },
        Instagram: {
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            ctr: '3.1%',
            cpc: '$0.60',
            conversions: '2,100',
            roi: '350%'
        }
    };

    const currentStats = platforms[selectedPlatform];

    return (
        <div className="pt-24 min-h-screen container-custom pb-20">
            <Seo 
                title="Google & Meta Ads Management | MM Universal"
                description="High-ROI advertising campaigns on Google, Facebook, and Instagram. Scale your business with targeted traffic."
                keywords="google ads management, facebook ads agency, ppc services, instagram marketing"
            />

            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                <div>
                    <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                        className="text-green-400 uppercase tracking-widest text-sm font-bold"
                    >
                        Precision Targeting
                    </motion.span>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 leading-tight"
                    >
                        Amplify Your <br/>
                        <span className="text-gradient-gold">Reach.</span>
                    </motion.h1>
                    <p className="text-slate-400 text-lg mb-8">
                        We design data-driven ad campaigns that reach your ideal customers at the right moment. Stop guessing, start converting.
                    </p>
                    <button className="btn-primary">Launch Campaign</button>
                </div>
                
                {/* Hero Image */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-2xl overflow-hidden glass-card p-2 border border-white/10"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                        alt="Analytics Dashboard" 
                        className="rounded-xl w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent"></div>
                </motion.div>
            </div>

            {/* Campaign Dashboard Demo */}
            <div className="mb-24">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold font-display">Live Performance Demo</h2>
                     <p className="text-slate-400 mt-2">See how we track and optimize your campaigns across platforms.</p>
                </div>

                <div className="glass-card p-8 border border-white/10">
                    {/* Platform Selector */}
                    <div className="flex justify-center gap-4 mb-10">
                        {Object.keys(platforms).map((platform) => (
                            <button
                                key={platform}
                                onClick={() => setSelectedPlatform(platform)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                    selectedPlatform === platform 
                                    ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <motion.div 
                            key={`ctr-${selectedPlatform}`} // Force re-render animation
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="p-6 bg-white/5 rounded-xl text-center"
                        >
                            <Target className={`w-8 h-8 mx-auto mb-3 ${currentStats.color}`} />
                            <h4 className="text-slate-400 text-sm mb-1">Click-Through Rate</h4>
                            <p className="text-2xl font-bold text-white">{currentStats.ctr}</p>
                        </motion.div>

                        <motion.div 
                             key={`cpc-${selectedPlatform}`}
                             initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                             className="p-6 bg-white/5 rounded-xl text-center"
                        >
                            <DollarSign className={`w-8 h-8 mx-auto mb-3 ${currentStats.color}`} />
                            <h4 className="text-slate-400 text-sm mb-1">Cost Per Click</h4>
                            <p className="text-2xl font-bold text-white">{currentStats.cpc}</p>
                        </motion.div>

                        <motion.div 
                             key={`conv-${selectedPlatform}`}
                             initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                             className="p-6 bg-white/5 rounded-xl text-center"
                        >
                            <TrendingUp className={`w-8 h-8 mx-auto mb-3 ${currentStats.color}`} />
                            <h4 className="text-slate-400 text-sm mb-1">Conversions</h4>
                            <p className="text-2xl font-bold text-white">{currentStats.conversions}</p>
                        </motion.div>

                        <motion.div 
                             key={`roi-${selectedPlatform}`}
                             initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
                             className="p-6 bg-white/5 rounded-xl text-center"
                        >
                            <BarChart2 className={`w-8 h-8 mx-auto mb-3 ${currentStats.color}`} />
                            <h4 className="text-slate-400 text-sm mb-1">Return on Ad Spend</h4>
                            <p className="text-2xl font-bold text-white">{currentStats.roi}</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <Search className="w-10 h-10 text-blue-400 mb-6" />
                    <h3 className="text-xl font-bold mb-2">Google Ads</h3>
                    <p className="text-slate-400 mb-6">Capture intent-driven traffic with Search, Display, and Shopping campaigns.</p>
                </div>
                <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <Facebook className="w-10 h-10 text-blue-600 mb-6" />
                    <h3 className="text-xl font-bold mb-2">Facebook Ads</h3>
                    <p className="text-slate-400 mb-6">Laser-focused audience targeting based on interests, behaviors, and demographics.</p>
                </div>
                <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <Instagram className="w-10 h-10 text-pink-500 mb-6" />
                    <h3 className="text-xl font-bold mb-2">Instagram Ads</h3>
                    <p className="text-slate-400 mb-6">Visually compelling story and feed ads to build brand awareness and sales.</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceAds;
