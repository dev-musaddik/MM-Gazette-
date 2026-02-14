import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import HeroSection from '../components/home/HeroSection';
import { FiArrowRight, FiTruck, FiShield, FiAward, FiClock } from 'react-icons/fi';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Home Page - MM Gazette BD
 * Premium fashion landing page
 */
const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { t } = useLanguage();

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 6 }));
  }, [dispatch]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  const features = [
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Official Warranty",
      description: "100% authentic products with official brand warranty."
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Express shipping across Bangladesh within 24-48 hours."
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "Multiple secure payment options including COD and EMI."
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Tech Support",
      description: "Expert technical support for all your gadget queries."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-background-paper border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 p-8 rounded-xl border border-white/5 hover:border-primary-500/50 transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 text-primary-500 mb-6 group-hover:bg-primary-500 group-hover:text-black transition-colors duration-300 shadow-neon-blue">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('/src/assets/grid.png')] opacity-5 bg-repeat pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-bold uppercase tracking-widest text-sm block mb-2 text-glow">Top Picks</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Trending Gadgets</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent mx-auto"></div>
          </div>

          {featuredProducts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading gadgets...</p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link 
              to="/products"
              className="inline-flex items-center space-x-2 border-b-2 border-primary-500 text-primary-500 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors pb-1"
            >
              <span>View All Gadgets</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-24 bg-background-paper relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Stay Updated</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest tech news, reviews, and exclusive deals.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-grow px-6 py-4 rounded-sm bg-black/50 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors backdrop-blur-sm"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-primary-500 text-black font-bold rounded-sm hover:bg-white hover:text-black transition-colors shadow-neon-blue uppercase tracking-wider"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
