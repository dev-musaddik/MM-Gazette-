import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';
import { LanguageProvider } from './i18n/LanguageContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import ArticleDetails from './pages/ArticleDetails';
import Reviews from './pages/Reviews';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import LandingPageManagement from './pages/admin/LandingPageManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import ArticleManagement from './pages/admin/ArticleManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import useAnalytics from './hooks/useAnalytics';

// Ad Landing Page (no navbar/footer)
import AdLandingPage from './pages/AdLandingPage';
import GuestOrderTracking from './pages/GuestOrderTracking';
import NotFound from './pages/NotFound';

// Root Redirect Component
const RootRedirect = () => {
  const savedLang = localStorage.getItem('language') || 'en';
  return <Navigate to={`/${savedLang}`} replace />;
};

// Component to track page views
const RouteTracker = () => {
  const location = useLocation();
  const { trackEvent } = useAnalytics('public');

  useEffect(() => {
    const lastPath = sessionStorage.getItem('last_view_path');
    const lastTime = sessionStorage.getItem('last_view_time');
    const now = Date.now();

    // Prevent duplicate tracking on reload (debounce 2 seconds)
    if (lastPath === location.pathname && lastTime && (now - parseInt(lastTime)) < 2000) {
      return;
    }

    trackEvent('VIEW', { path: location.pathname });
    
    sessionStorage.setItem('last_view_path', location.pathname);
    sessionStorage.setItem('last_view_time', now.toString());
  }, [location, trackEvent]);

  return null;
};

// Layout Component to wrap Navbar and Footer
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

/**
 * Main App Component with URL-based Bilingual Support
 */
// Language Route Wrapper to handle invalid language params
const LanguageRouteWrapper = ({ children }) => {
  const { lang } = useParams();
  const savedLang = localStorage.getItem('language') || 'en';
  const location = useLocation();

  if (lang !== 'en' && lang !== 'bn') {
    return <Navigate to={`/${savedLang}${location.pathname}`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="!bg-gray-900 !text-primary-100 !border !border-primary-500/30 !rounded-xl !shadow-2xl !shadow-primary-500/10"
          progressClassName="!bg-primary-500"
        />
        <RouteTracker />
        <Routes>
          {/* Root Redirect: / -> /en or /bn */}
          <Route path="/" element={<RootRedirect />} />

          {/* Ad Landing Page - Public but not in navigation (outside lang structure for simplicity or keep it?) 
              Keeping it outside for now as it might be shared directly. 
              If needed inside, can be added to the :lang group.
          */}
          <Route path="/ad/:slug" element={<AdLandingPage />} />
          <Route path="/track-order/:orderId" element={<GuestOrderTracking />} />


          {/* Localized Routes */}
          <Route path="/:lang/*" element={
            <LanguageRouteWrapper>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:slug" element={<ArticleDetails />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/track/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <ProductManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <OrderManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <UserManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/landing-pages"
                    element={
                      <AdminRoute>
                        <LandingPageManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        <CategoryManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/brands"
                    element={
                      <AdminRoute>
                        <BrandManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminRoute>
                        <AnalyticsDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/articles"
                    element={
                      <AdminRoute>
                        <ArticleManagement />
                      </AdminRoute>
                    }
                  />
                
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </LanguageRouteWrapper>
          } />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

export default App;
