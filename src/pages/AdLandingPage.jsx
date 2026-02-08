import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../redux/api/apiService';
import useAnalytics from '../hooks/useAnalytics';
import Spinner from '../components/common/Spinner';
import { FiCheck, FiPhone, FiShoppingBag, FiTruck, FiShield, FiAward } from 'react-icons/fi';
import GuestCheckoutForm from '../components/common/GuestCheckoutForm';
import Navbar from '../components/common/Navbar';

/**
 * Ad Landing Page - Purple/Yellow Bangla Edition
 * Optimized for high conversions with specific design request
 */
const AdLandingPage = () => {
  const { slug } = useParams();
  
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Variant State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const checkoutRef = useRef(null);

  const scrollToCheckout = () => {
    trackEvent('CTA_CLICK', { button: 'Order Now', position: 'Hero' });
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { trackEvent } = useAnalytics('landing', landingPage?._id);

  useEffect(() => {
    fetchLandingPage();
  }, [slug]);

  const fetchLandingPage = async () => {
    try {
      const response = await api.get(`/api/landing-pages/${slug}`);
      setLandingPage(response.data.landingPage);
      
      const product = response.data.landingPage.product;
      if (product.sizes??.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors??.length > 0) setSelectedColor(product.colors[0]);
      
    } catch (error) {
      console.error('Failed to fetch landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track page visit once data is loaded
  useEffect(() => {
    if (landingPage?._id) {
      trackEvent('VISIT');
    }
  }, [landingPage?._id, trackEvent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Page Not Found</h1>
          <p className="text-gray-300">This offer may have expired.</p>
        </div>
      </div>
    );
  }

  const { product } = landingPage;
  const displayPrice = landingPage.specialPrice || product.basePrice;
  const originalPrice = landingPage.originalPrice || product.basePrice * 1.2; // Fallback for demo

  return (
    <div className="min-h-screen bg-[#1a0b2e] font-sans text-white overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-[#0f0518] py-4 px-4 sm:px-8 sticky top-0 z-50 border-b border-purple-900/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white tracking-tighter">
            <span className="text-yellow-400">MM</span> Gazette
          </div>
          <button 
            onClick={scrollToCheckout}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] flex items-center gap-2"
          >
            <FiPhone className="w-4 h-4" />
            যোগাযোগ করুন
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="text-left space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-yellow-400 block mb-2">{landingPage.headline}</span>
              <span className="text-white">{landingPage.subheadline || 'অনুভব করার জন্য'}</span>
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-purple-500 pl-4">
              {landingPage.description}
            </p>

            <button
              onClick={scrollToCheckout}
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xl font-bold px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <FiShoppingBag className="w-6 h-6" />
              অর্ডার করতে ক্লিক করুন
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-yellow-400 rounded-2xl blur-lg opacity-30 transform rotate-3"></div>
            <div className="relative bg-[#2d1b4e] p-2 rounded-2xl border border-purple-500/30 shadow-2xl">
              <img
                src={landingPage.images?.[0] || product.images?.[0]}
                alt={product.name}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID (Why Choose Us) */}
      <section className="py-16 bg-[#c4b5fd] text-[#2e1065]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            কেন এই {product.name} আপনার কালেকশনে থাকা উচিত?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPage.features && landingPage.features?.length > 0 ? (
              landingPage.features.map((feature, idx) => (
                <div key={idx} className="bg-[#2e1065] text-white p-6 rounded-xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300 border border-purple-400/30">
                  <div className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 text-yellow-400">
                    <FiCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">প্রিমিয়াম কোয়ালিটি</h3>
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))
            ) : (
              // Default features if none provided
              [1, 2, 3, 4, 5, 6].map((_, idx) => (
                <div key={idx} className="bg-[#2e1065] text-white p-6 rounded-xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300 border border-purple-400/30">
                  <div className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 text-yellow-400">
                    <FiAward className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">সেরা মান</h3>
                  <p className="text-gray-300 text-sm">আমরা দিচ্ছি সেরা মানের নিশ্চয়তা যা আপনাকে মুগ্ধ করবে।</p>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={scrollToCheckout}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-10 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              অর্ডার করতে চাই
            </button>
          </div>
        </div>
      </section>

      {/* PRICING & OFFER */}
      <section className="py-16 bg-[#1a0b2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="border-2 border-dashed border-yellow-500/50 rounded-2xl p-8 sm:p-12 bg-[#2d1b4e]/50 backdrop-blur-sm">
            <h3 className="text-2xl text-red-400 font-bold mb-2 line-through decoration-2">
              রেগুলার মূল্য {originalPrice} টাকা
            </h3>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              অফার প্রাইস {displayPrice} টাকা
            </h2>
            <p className="text-yellow-400 text-lg mb-8 font-medium">
              যেকোন প্রয়োজনে নিচে দেয়া নাম্বারে যোগাযোগ করুন
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                <FiPhone className="w-5 h-5" />
                অফিসে কল করুন
              </button>
              <button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                <FiPhone className="w-5 h-5" />
                হোয়াটসঅ্যাপ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-12 bg-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 bg-gray-200 inline-block px-6 py-2 rounded-lg">
            {product.name}-এর কিছু ছবি
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(landingPage.images??.length ? landingPage.images : product.images || []).slice(0, 4).map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER FORM SECTION */}
      <section ref={checkoutRef} className="py-16 bg-[#2e1065]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-purple-100 p-4 text-center border-b border-purple-200">
              <h3 className="text-xl font-bold text-purple-900">
                অফারটি সীমিত সময়ের জন্য, তাই অফার শেষ হওয়ার আগেই অর্ডার করুন
              </h3>
            </div>
            
            <div className="p-6 sm:p-8">
              {/* Product Summary in Form Header */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <img 
                  src={landingPage.images?.[0] || product.images?.[0]} 
                  alt="Product" 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{product.name}</h4>
                  <div className="text-purple-700 font-bold">মূল্য: {displayPrice} টাকা</div>
                </div>
              </div>

              <GuestCheckoutForm 
                product={landingPage.product} 
                quantity={quantity}
                setQuantity={setQuantity}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                submitButtonClass="!bg-[#7c3aed] !hover:bg-[#6d28d9] !text-white !border-none"
                onSuccess={async (order) => {
                   try {
                     trackEvent('LEAD', { quantity, total: displayPrice * quantity });
                     
                     // Redirect to tracking page after 1.5s
                     setTimeout(() => {
                        window.location.href = `/track-order/${order._id}`;
                     }, 1500);
                   } catch (e) {
                     console.error("Conversion tracking failed", e);
                     // Still redirect even if tracking fails
                     setTimeout(() => {
                        window.location.href = `/track-order/${order._id}`;
                     }, 1500);
                   }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f0518] text-gray-400 py-8 text-center border-t border-purple-900/30">
        <p>© {new Date().getFullYear()} MM Gazette BD. All rights reserved.</p>
      </footer>

      {/* MOBILE STICKY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={scrollToCheckout}
          className="w-full bg-[#7c3aed] text-white py-3 rounded-lg font-bold text-lg shadow-lg animate-pulse"
        >
          অর্ডার করতে ক্লিক করুন - {displayPrice} টাকা
        </button>
      </div>

    </div>
  );
};

export default AdLandingPage;
