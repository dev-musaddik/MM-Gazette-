import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const { cartCount, cart, cartTotal } = useCart();

  const { t } = useTranslation();

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.blog'), path: '/blog' },
  ];

  const serviceLinks = [
    { name: t('navbar.services'), path: '/services' },
    { name: t('services.webDevelopment'), path: '/web-sale' },
    { name: t('services.uiUxDesign'), path: '/services/design' },
    { name: t('services.graphicVideo'), path: '/services/creative' }, // New Link
    { name: t('services.seoGrowth'), path: '/services/seo' },
    { name: t('services.adsManagement'), path: '/services/ads' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md py-4 shadow-lg border-b border-border' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <img src="/logo.svg" alt="MM Universal" className="w-10 h-10 rounded-xl shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform duration-300" />
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
            Universal
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors duration-300 relative group ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {t('navbar.home')}
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
              location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          {/* Services Dropdown */}
          <div className="relative group">
            <button className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${
              location.pathname.includes('/services') || location.pathname === '/web-sale' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}>
              {t('navbar.services')} <ChevronRight className="w-3 h-3 rotate-90 group-hover:rotate-[-90deg] transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
              <div className="glass-card p-2 w-56 flex flex-col gap-1">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors duration-300 relative group ${
              location.pathname.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {t('navbar.blog')}
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
              location.pathname.startsWith('/blog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          <Link
            to="/portfolio"
            className={`text-sm font-medium transition-colors duration-300 relative group ${
              location.pathname === '/portfolio' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {t('navbar.portfolio')}
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
              location.pathname === '/portfolio' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>
            
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors duration-300 relative group ${
              location.pathname === '/contact' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {t('navbar.contact')}
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
              location.pathname === '/contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>

          {/* Cart Dropdown */}
          <div className="relative group z-50">
            <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors py-2">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                  </span>
              )}
            </Link>

            {/* Dropdown Content */}
            <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-80">
              <div className="glass-card p-4">
                <h4 className="font-bold text-foreground mb-3 border-b border-border pb-2">{t('navbar.cart')} ({cartCount})</h4>
                
                {cart && cart.length > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-3 mb-4">
                      {cart.map((item, idx) => {
                         // Handle potential nested product structure or flat structure
                         const img = item.image || (item.product && item.product.image) || (item.product && item.product.images && item.product.images[0]) || 'https://via.placeholder.com/50';
                         const name = item.name || (item.product && item.product.name) || 'Product';
                         const price = item.price || (item.product && item.product.basePrice) || 0;
                         
                         return (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded bg-secondary overflow-hidden flex-shrink-0">
                              <img src={img} alt={name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{name}</p>
                              <p className="text-xs text-muted-foreground">{item.quantity} x ${price}</p>
                            </div>
                          </div>
                         );
                      })}
                    </div>
                    
                    <div className="border-t border-border pt-3 mb-3">
                      <div className="flex justify-between items-center text-sm font-bold text-foreground">
                        <span>Total:</span>
                        <span className="text-accent">${cartTotal}</span>
                      </div>
                    </div>

                    <Link 
                      to="/checkout" 
                      className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2"
                    >
                      {t('navbar.checkout')} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t('navbar.emptyCart')}</p>
                    <Link to="/portfolio" className="text-xs text-accent hover:underline mt-2 block">{t('navbar.browsePortfolio')}</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link
            to="/track-order"
            className={`text-sm font-medium transition-colors duration-300 relative group ${
              location.pathname === '/track-order' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {t('navbar.trackOrder')}
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
              location.pathname === '/track-order' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Link>
          
          {userInfo ? (
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-300 hidden lg:block">{t('navbar.hi')}, {userInfo.name.split(' ')[0]}</span>
              {userInfo.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  {t('navbar.dashboard')}
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="btn-outline py-2 px-6 text-sm hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500"
              >
                {t('navbar.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link to="/login" className="text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-foreground transition-colors">
                {t('navbar.login')}
              </Link>
              <Link 
                to="/register" 
                className="btn-primary py-2 px-6 text-sm flex items-center gap-2 group"
              >
                {t('navbar.startProject')}
                <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-primary-dark z-40 transition-transform duration-500 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
             {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-display font-medium ${
                  location.pathname === link.path ? 'text-accent' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-display font-medium ${
                  location.pathname === '/cart' ? 'text-accent' : 'text-slate-300'
                }`}
              >
                Cart
              </Link>
            {userInfo ? (
              <>
                {userInfo.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-medium text-slate-300">
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-display font-medium text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display font-medium text-slate-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 btn-primary w-full max-w-xs justify-center flex items-center gap-2"
                >
                  Register <ChevronRight className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
