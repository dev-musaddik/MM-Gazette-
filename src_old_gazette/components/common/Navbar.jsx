import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSearch, FiPackage } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import SearchModal from './SearchModal';

/**
 * Navbar Component - MM Gazette BD
 * Premium glassmorphism navigation with smooth interactions
 */
const Navbar = ({ darkMode = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, getLocalizedPath } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate(getLocalizedPath('/'));
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gadgets', path: '/products' },
    { name: 'Reviews', path: '/reviews' }, // To be implemented
    { name: 'News', path: '/news' },       // To be implemented
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass-card shadow-neon-blue py-2 border-b border-primary-500/20'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={getLocalizedPath('/')} className="flex items-center space-x-3 group">
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-primary-500 shadow-neon-blue group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-black">
                <span className="text-primary-500 font-display font-bold text-xl">MM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-wide text-white group-hover:text-primary-500 transition-colors text-glow">
                  MM Gazette BD
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={getLocalizedPath(link.path)}
                  className={`text-sm uppercase tracking-widest font-display font-medium transition-colors relative group ${
                    location.pathname === getLocalizedPath(link.path) 
                      ? 'text-primary-500 text-glow' 
                      : 'text-gray-300 hover:text-primary-500'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 shadow-neon-blue ${
                    location.pathname === getLocalizedPath(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 hover:text-primary-500 transition-colors"
                title="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <Link to={getLocalizedPath('/cart')} className="relative group p-2">
                <FiShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-neon-blue animate-pulse-slow">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to={getLocalizedPath('/profile')}
                    className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    <FiUser className="w-5 h-5" />
                  </Link>
                  <Link
                    to={getLocalizedPath('/orders')}
                    className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors"
                    title="My Orders"
                  >
                    <FiPackage className="w-5 h-5" />
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to={getLocalizedPath('/admin/dashboard')}
                      className="text-xs font-bold px-3 py-1 border border-primary-500 text-primary-500 rounded-sm hover:bg-primary-500 hover:text-black transition-colors uppercase tracking-wider shadow-neon-blue"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title={t('logout')}
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to={getLocalizedPath('/login')}
                    className="font-display font-medium text-sm uppercase tracking-wider text-gray-300 transition-colors hover:text-primary-500"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to={getLocalizedPath('/signup')}
                    className="px-5 py-2 bg-primary-500 text-black text-sm font-bold rounded-sm hover:bg-white hover:text-black transition-all duration-300 shadow-neon-blue uppercase tracking-wider"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full glass-card border-t border-white/10 animate-slide-up">
              <div className="p-4 space-y-4">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={getLocalizedPath(link.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-center py-2 font-display font-medium uppercase tracking-widest transition-colors ${
                      location.pathname === getLocalizedPath(link.path)
                        ? 'text-primary-500 text-glow'
                        : 'text-gray-300 hover:text-primary-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {user ? (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Link
                      to={getLocalizedPath('/profile')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-gray-300 hover:text-primary-500"
                    >
                      {t('profile')}
                    </Link>
                    <Link
                      to={getLocalizedPath('/orders')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-gray-300 hover:text-primary-500"
                    >
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={getLocalizedPath('/admin/dashboard')}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center py-2 text-primary-500 font-bold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center py-2 text-red-500 hover:text-red-600"
                    >
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Link
                      to={getLocalizedPath('/login')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-gray-300"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to={getLocalizedPath('/signup')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 bg-primary-500 text-black rounded-sm mx-8 font-bold uppercase"
                    >
                      Join
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
