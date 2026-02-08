import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../redux/api/apiService';
import { useLanguage } from '../../i18n/LanguageContext';
import Spinner from '../../components/common/Spinner';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiExternalLink, FiActivity, FiFileText } from 'react-icons/fi';

/**
 * Admin Dashboard Page
 * Overview with analytics and quick stats
 */
const Dashboard = () => {
  const { t, getLocalizedPath } = useLanguage();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes, userStatsRes] = await Promise.all([
        api.get('/api/orders/admin/all'),
        api.get('/api/products'),
        api.get('/api/auth/admin/stats'),
      ]);

      setStats({
        totalProducts: productsRes.data.count || 0,
        totalOrders: ordersRes.data.count || 0,
        totalRevenue: ordersRes.data.totalRevenue || 0,
        totalUsers: userStatsRes.data.totalUsers || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('totalProducts'),
      value: stats.totalProducts,
      icon: <FiPackage className="w-8 h-8" />,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
      link: getLocalizedPath('/admin/products'),
    },
    {
      title: t('totalOrders'),
      value: stats.totalOrders,
      icon: <FiShoppingBag className="w-8 h-8" />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      link: getLocalizedPath('/admin/orders'),
    },
    {
      title: t('totalRevenue'),
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <FiDollarSign className="w-8 h-8" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      link: getLocalizedPath('/admin/orders'),
    },
    {
      title: t('totalUsers'),
      value: stats.totalUsers,
      icon: <FiUsers className="w-8 h-8" />,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      link: getLocalizedPath('/admin/users'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8 text-glow">{t('adminDashboard')}</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className={`bg-white/5 rounded-xl border ${stat.border} p-6 hover:shadow-neon-blue transition transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-4 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={getLocalizedPath('/admin/products')}
              className="p-4 border border-primary-500/30 bg-primary-500/5 rounded-lg hover:bg-primary-500/10 transition text-center group"
            >
              <FiPackage className="w-8 h-8 mx-auto mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">{t('manageProducts')}</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/orders')}
              className="p-4 border border-green-500/30 bg-green-500/5 rounded-lg hover:bg-green-500/10 transition text-center group"
            >
              <FiShoppingBag className="w-8 h-8 mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">{t('manageOrders')}</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/users')}
              className="p-4 border border-orange-500/30 bg-orange-500/5 rounded-lg hover:bg-orange-500/10 transition text-center group"
            >
              <FiUsers className="w-8 h-8 mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">{t('manageUsers')}</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/landing-pages')}
              className="p-4 border border-purple-500/30 bg-purple-500/5 rounded-lg hover:bg-purple-500/10 transition text-center group"
            >
              <FiExternalLink className="w-8 h-8 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">Landing Pages</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/analytics')}
              className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-lg hover:bg-blue-500/10 transition text-center group"
            >
              <FiActivity className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">Analytics</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/categories')}
              className="p-4 border border-pink-500/30 bg-pink-500/5 rounded-lg hover:bg-pink-500/10 transition text-center group"
            >
              <FiPackage className="w-8 h-8 mx-auto mb-2 text-pink-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">Categories</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/brands')}
              className="p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-lg hover:bg-yellow-500/10 transition text-center group"
            >
              <FiPackage className="w-8 h-8 mx-auto mb-2 text-yellow-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">Brands</p>
            </Link>
            <Link
              to={getLocalizedPath('/admin/articles')}
              className="p-4 border border-indigo-500/30 bg-indigo-500/5 rounded-lg hover:bg-indigo-500/10 transition text-center group"
            >
              <FiFileText className="w-8 h-8 mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-300 group-hover:text-white">Articles</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
