import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const HeroSection = () => {
  const heroRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Parallax Effect */}
      <div 
        ref={heroRef}
        className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 transition-transform duration-100 ease-out"
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute inset-0 bg-[url('/src/assets/grid.png')] opacity-20 bg-repeat"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-bold text-white mb-6 animate-fade-in tracking-tighter leading-none">
          <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">NEXT GEN</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-200 to-primary-400 animate-shimmer bg-300% text-glow">
            TECH HUB
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-body font-light tracking-wide animate-slide-up delay-200">
          Discover the latest in technology, from cutting-edge smartphones to high-performance gaming gear.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-400">
          <Link 
            to="/products" 
            className="group relative px-8 py-4 bg-primary-500 text-black font-bold rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-neon-blue skew-x-[-10deg]"
          >
            <span className="relative z-10 uppercase tracking-widest text-sm block skew-x-[10deg]">Explore Gadgets</span>
            <div className="absolute inset-0 bg-white/40 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </Link>
          
          <Link 
            to="/reviews" 
            className="group px-8 py-4 border border-primary-500 text-primary-500 font-bold rounded-sm hover:bg-primary-500/10 transition-all duration-300 backdrop-blur-sm skew-x-[-10deg]"
          >
            <span className="block skew-x-[10deg] uppercase tracking-widest text-sm group-hover:text-primary-400 transition-colors">Read Reviews</span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-primary-500/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-primary-500 rounded-full animate-scroll-down shadow-neon-blue"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
