import { motion } from 'framer-motion';
import { ArrowRight, Code, Layout, TrendingUp, Rocket, Target, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/layout/Seo';

import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Code className="w-6 h-6" />,
      title: t('services.webDevelopment'),
      description: "Custom, high-performance websites built with modern technologies like React, Next.js, and Node.js.",
      link: "/web-sale"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: t('services.uiUxDesign'),
      description: "User-centric designs that convert. We create intuitive interfaces that look stunning.",
      link: "/services/design"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t('services.adsManagement'),
      description: "High-ROI campaigns on Google & Meta. Reach your perfect customer instantly.",
      link: "/services/ads"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('services.seoGrowth'),
      description: "Organic strategies to dominate search results and build long-term traffic.",
      link: "/services/seo"
    }
  ];

  return (
    <>
      <Seo 
        title="MM Universal | #1 Digital Agency for Web Design & SEO"
        description="Transform your business with premium web design, SEO, and ad management services. We build digital success stories."
        keywords="web design agency, digital marketing experts, seo services, google ads management, custom web development, buy website"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                alt="Digital Universe" 
                className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/80 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6 backdrop-blur-sm">
              {t('hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight drop-shadow-2xl">
              {t('hero.welcome').split(' ')[0]} <br />
              <span className="text-gradient-gold">{t('hero.welcome').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary w-full sm:w-auto shadow-lg shadow-accent/20 hover:shadow-accent/40">
                {t('hero.ctaPrimary')}
              </Link>
              <Link to="/portfolio" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 group backdrop-blur-md">
                {t('hero.ctaSecondary')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 pt-10 border-t border-white/5"
          >
            <p className="text-slate-500 text-sm mb-6 font-medium tracking-widest">TRUSTED BY INNOVATIVE BRANDS</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['TechCorp', 'Innova', 'GlobalBiz', 'FutureScale', 'DevPoint'].map((brand) => (
                 <span key={brand} className="text-xl font-display font-bold text-white/50 hover:text-white transition-colors cursor-pointer">{brand}</span>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 relative bg-primary-light/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Our Core Expertise</h2>
            <p className="text-slate-400 text-lg">
              Comprehensive digital services designed to elevate your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-8 group hover:bg-white/10 transition-colors duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">{service.title}</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
                <Link to={service.link} className="text-accent font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm mt-auto">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project / CTA Section with Image */}
      <section className="py-24">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center p-8 md:p-20">
             {/* Background Image */}
             <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary-dark/90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent"></div>
             </div>

             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Transform Your Business?</h2>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                  Join hundreds of satisfied clients who have scaled their operations with our digital solutions. We combine creativity with technical excellence to deliver results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2">
                    Get Your Free Quote <Rocket className="w-4 h-4" />
                  </Link>
                  <Link to="/services" className="btn-outline inline-flex items-center justify-center gap-2">
                    Explore Services
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
