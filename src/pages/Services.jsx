import { Link } from 'react-router-dom';
import { Layout, TrendingUp, Code, ArrowRight, Target, Palette } from 'lucide-react';

import Head from '../components/layout/Seo';

const Services = () => {
    return (
      <div className="pt-32 pb-20 container-custom">
        <Head 
             title="Digital Services | MM Universal"
             description="Comprehensive digital solutions: Web Development, SEO, UI/UX Design, and Ads Management. We scale businesses."
             keywords="digital marketing services, web development packages, seo agency, google ads management"
        />
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-foreground">Our Services</h1>
        <p className="text-muted-foreground text-lg">Explore our comprehensive range of digital solutions.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Nav Cards */}
            <Link to="/services/design" className="glass-card p-8 hover:bg-accent/5 transition-colors group">
                <div className="w-12 h-12 bg-pink-500/10 rounded-lg mb-4 flex items-center justify-center text-pink-500">
                    <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-pink-500 transition-colors">UI/UX Design</h3>
                <p className="text-muted-foreground mb-4">Premium interfaces and user-centric experiences.</p>
                <div className="flex items-center text-sm font-medium text-pink-500">
                    View Demo <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* New Graphic & Video Card */}
            <Link to="/services/creative" className="glass-card p-8 hover:bg-accent/5 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg mb-4 flex items-center justify-center text-purple-500">
                    <Palette className="w-6 h-6" /> {/* Using Palette icon from lucide-react */}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-purple-500 transition-colors">Graphic & Video</h3>
                <p className="text-muted-foreground mb-4">Logos, banners, and professional video editing.</p>
                <div className="flex items-center text-sm font-medium text-purple-500">
                    View Portfolio <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            <Link to="/services/seo" className="glass-card p-8 hover:bg-accent/5 transition-colors group">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg mb-4 flex items-center justify-center text-orange-500">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-orange-500 transition-colors">SEO & Growth</h3>
                <p className="text-muted-foreground mb-4">Data-driven strategies to scale your traffic.</p>
                <div className="flex items-center text-sm font-medium text-orange-500">
                    View Data <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            <Link to="/services/ads" className="glass-card p-8 hover:bg-accent/5 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg mb-4 flex items-center justify-center text-blue-500">
                    <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-blue-500 transition-colors">Ads Management</h3>
                <p className="text-muted-foreground mb-4">High-ROI campaigns on Google & Meta.</p>
                <div className="flex items-center text-sm font-medium text-blue-500">
                    View Campaigns <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            <Link to="/web-sale" className="glass-card p-8 hover:bg-accent/5 transition-colors group">
                <div className="w-12 h-12 bg-accent/20 rounded-lg mb-4 flex items-center justify-center text-accent">
                    <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">Web Development</h3>
                <p className="text-muted-foreground mb-4">Custom websites and web applications.</p>
                <div className="flex items-center text-sm font-medium text-accent">
                    View Packages <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>
      </div>
    );
  };
  
  export default Services;
