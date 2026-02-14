import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import WebSale from './pages/WebSale';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import ContactList from './pages/admin/ContactList';
import LandingPageList from './pages/admin/LandingPageList';
import LandingPageLeads from './pages/admin/LandingPageLeads';
import EditLandingPage from './pages/admin/EditLandingPage';
import DynamicLandingPage from './pages/DynamicLandingPage';
import AdminSettings from './pages/admin/AdminSettings';
import ServiceSEO from './pages/ServiceSEO';
import ServiceDesign from './pages/ServiceDesign';
import ServiceCreative from './pages/ServiceCreative'; // New Import
import ServiceAds from './pages/ServiceAds';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';

import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import OrderTracking from './pages/OrderTracking';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import { Toaster } from 'react-hot-toast';
import GoogleIntegration from './components/common/GoogleIntegration';

function App() {
  return (
    <Router>
      <CartProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <GoogleIntegration />
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white transition-colors duration-300">
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#3b82f6', // Accent blue
                  secondary: '#fff',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/seo" element={<ServiceSEO />} />
              <Route path="/services/design" element={<ServiceDesign />} />
              <Route path="/services/creative" element={<ServiceCreative />} /> {/* New Route */}
              <Route path="/services/ads" element={<ServiceAds />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/web-sale" element={<WebSale />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/:id/edit" element={<ProductForm />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/messages" element={<ContactList />} />
              <Route path="/admin/landing-pages" element={<LandingPageList />} />
              <Route path="/admin/landing-pages/leads" element={<LandingPageLeads />} />
              <Route path="/admin/landing-pages/new" element={<EditLandingPage />} />
              <Route path="/admin/landing-pages/edit/:id" element={<EditLandingPage />} />
              <Route path="/admin/blog" element={<AdminBlogList />} />
              <Route path="/admin/blog/new" element={<AdminBlogEdit />} />
              <Route path="/admin/blog/edit/:id" element={<AdminBlogEdit />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/lp/:slug" element={<DynamicLandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </ThemeProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
