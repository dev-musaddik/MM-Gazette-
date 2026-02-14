import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Footer Component - Dhaka Homemade Art Gallery
 * Artistic footer with gallery information - Bilingual
 */
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 overflow-hidden rounded-lg flex items-center justify-center border border-primary-500 shadow-neon-blue">
                 <span className="text-primary-500 font-display font-bold text-lg">MM</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white text-glow">MM Gazette BD</h3>
                <p className="text-sm text-gray-400 font-body">Future of Tech</p>
              </div>
            </div>
            <p className="text-gray-400 font-body text-sm leading-relaxed">
              Your ultimate destination for the latest gadgets, in-depth reviews, and tech news. Stay ahead of the curve with MM Gazette BD.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-primary-500">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Gadgets
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Tech News
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-primary-500">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Smartphone" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptop" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wearables" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=Gaming" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  Gaming
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-primary-500">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 font-body text-sm">
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+8801234567890" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:contact@mmgazettebd.com" className="text-gray-400 hover:text-primary-500 transition font-body text-sm">
                  contact@mmgazettebd.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-body font-semibold mb-3 text-primary-500">Follow Us</h5>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-black transition duration-300"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-black transition duration-300"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-black transition duration-300"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm font-body">
              © {new Date().getFullYear()} MM Gazette BD. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-500 transition text-sm font-body">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition text-sm font-body">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
